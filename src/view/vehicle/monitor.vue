<template>
  <div class="vehicle-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList[0] && groupList[0].children"
          :props="defaultProps" @node-click="handleNodeClick" 
          :default-expanded-keys="taskId" node-key="id">
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="vehicle-content">
      <div class="content-main">
        <div class="vehicle-video"></div>
        <div class="vehicle-current-list">
          <div class="title">最近捕获车辆</div>
          <div class="list">
            <div class="cell" v-for="(pic, index) in vehiclePicList" :key="pic+index">
              <img :src="downloadFile(pic)" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <div class="title">今日0点至今各类车进出统计表</div>
        <div class="table">
          <el-table :data="tableList" style="width: 100%">
            <!-- <template v-for="(list) in tableList">
              <el-table-column :label="`${getDisplayDict(list[0], carTypeDict)}`" width="240" align="center" :key="list[0]">
                <el-table-column :label="`${getDisplayDict(carData.status, carEntranceType)}`" width="80" align="center" prop="enter" v-for="(carData, index) in list[1]" :key="carData.cartype+index">
                  <template slot-scope>
                    <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ carData.count }}</a>
                  </template>
                </el-table-column>
              </el-table-column>
            </template> -->
            <template v-for="(carType) in carTypeDict">
              <el-table-column :label="carType.detailName" width="240" align="center" :key="carType.id">
                <el-table-column :label="entranceType.detailName" width="80" align="center"
                  :prop="`${carType.detailValue + '-' + entranceType.detailValue}-count`"
                  v-for="(entranceType) in carEntranceType" :key="entranceType.id">
                    <template slot-scope="scope">
                      <a @click="toDetail(carType.detailValue, entranceType.detailValue)" style="color: #fff;cursor: pointer;">
                        <u>{{ scope.row[`${carType.detailValue + '-' + entranceType.detailValue}-count`] }}</u>
                      </a>
                    </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="查看"
      :visible="showPreview"
      width="100%"
      fullscreen
      @close="close"
    >
      <preview-pic :picList="picList"></preview-pic>
    </el-dialog>
  </div>
</template>

<script>
import vehicleAPI from '@/api/vehicleAPI'
import commonAPI from '@/api/commonAPI'
import groupAPI from '@/api/groupAPI'
import taskAPI from '@/api/taskAPI'
import previewPic from '@/components/previewPic'
import groupMixins from '@/mixins/groupMixins'
import ReconnectingWebSocket from 'reconnecting-websocket'
import dayjs from 'dayjs'
export default {
  mixins: [groupMixins],
  components: {previewPic},
  data () {
    return {
      ws: '',
      showPreview: false,
      currentCameraCode: 0,
      recentPicId: 0,
      statId: 0,
      picList: [],
      taskList: [],
      taskId: [],
      tableList: [
        { '3-1-count': 10 }
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      carTypeDict: [],
      carEntranceType: [],
      type: '0-CAR',
      taskType: 'CAR',
      vehiclePicList: [],
      emptyData: [{}],
      players: []
    }
  },
  watch: {
    taskList () {
      console.log(this.groupList)
      this.getCamera()
    }
  },
  created () {
    // this.getData()
  },
  beforeDestroy () {
    this.destroyVideo()
    if (this.ws) this.ws.close()
    // clearInterval(this.recentPicId)
    // clearInterval(this.statId)
  },
  mounted () {
    this.resize()
    this.getPlayers(1)
    this.getDict('CAR_TYPE', 'carTypeDict')
    this.getDict('CAR_ENTRANCE_TYPE', 'carEntranceType')
  },
  methods: {
    autoPlay () {
      const params = this.$route.query.data
      if (params) {
        const data = JSON.parse(params)
        this.getTaskId(data.camera)
        // const ids = this.taskList.find(item => item.cameraCodes.includes(data.camera))
        // this.taskId = [ids.id]
        this.currentCameraCode = data.camera
        this.getStatFromData(data.camera)
        this.getRecentListFromRedis(data.camera)
        this.startVideo({cameraCodes: data.camera})
        // this.loopMethod()
      }
    },
    loopMethod () { 
      clearInterval(this.recentPicId)
      clearInterval(this.statId)
      this.recentPicId = setInterval(() => {
        this.getRecentListFromRedis(this.currentCameraCode)
      }, 10000)
      this.statId = setInterval(() => {
        this.getStatFromData(this.currentCameraCode || 'D3C01')
      }, 15000)
    },
    getPlayers (isMounted) {
      const rect = document.querySelector('.vehicle-video').getBoundingClientRect()
      var players =  [
        { 
          id: '1',
          x: rect.left,
          y: rect.top,
          w: rect.width,
          h: rect.height
        }
      ]
      this.players = players
      console.log(players)
      isMounted && this.createVideo()
    },
    resize () {
      window.onresize = () => {
        this.getPlayers()
        var json = {
          players: this.players
        }
        window.bykj && window.bykj.frameCall('adjustplayer', JSON.stringify(json))
      }
    },
    getDict (value, name) {
      const params = {
        dictValue: value
      }
      commonAPI.getDictByValue(params).then(res => {
        this[name] = res.data.payload
      })
    },
    getDisplayDict (value, arr) {
      return this.$commonJS.getDisplayDict(value, arr)
    },
    toDetail (carType, entranceType) {
      this.showPreview = true
      window.bykj.frameCall('hideplayer', JSON.stringify({type: 'all'}))
      const params = {
        carType,
        status: entranceType,
        'createTime_gt': dayjs().format('YYYY-MM-DD 00:00:00'),
        areaCode: this.currentCameraCode
      }
      vehicleAPI.getStatDetailList(params).then(res => {
        this.picList = res.data.payload.map(item => {
          item.fileList = JSON.parse(item.fileList)
          return item
        })
      })
    },
    close () {
      this.showPreview = false
      window.bykj.frameCall('showplayer', JSON.stringify({type: 'all'}))
    },
    handleNodeClick (data) {
      if (data.cameraCodes) {
        this.getTaskId(data.cameraCodes)
        this.currentCameraCode = data.cameraCodes
        this.getStatFromData(data.cameraCodes)
        this.getRecentListFromRedis(data.cameraCodes)
        this.startVideo(data)
        // this.loopMethod()
      }
    },
    getTaskId (camera) {
      const ids = this.taskList.find(item => item.cameraCodes.includes(camera))
      this.taskId = [ids.id]
    },
    getTaskList (data, cb) {
        const params = {
        groupId: data.id
      }
      taskAPI.getTaskPageList(0, 100, params).then(res => {
        cb(res.data.payload.rows)
      })
    },
    getCamera () {
      groupAPI.getCameraListByGroupId().then(res => {
        this.cameraList = res.data.payload
        console.log(this.cameraList)
        this.autoPlay()
      })
    },
    loadNode (node, resolve) {
      if (node.level === 1) {
        return resolve(node.data.children)
      }
      if (!node.data.parentId) {
        return resolve([])
      }
      this.getTaskList(node.data, (data) => {
        if (!node.data.children) node.data.children = []
        const children = node.data.children.concat(data).map(item => {
          if (!item.parentId) item.leaf = true
          return item
        })
        return resolve(children)
      })
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    getStatFromData (code) {
      const params = {
        'createTime_gt': dayjs().format('YYYY-MM-DD 00:00:00'),
        // 'createTime_gt': '2021-07-11 00:00:00',
        cameraCode : code
      }
      vehicleAPI.getStatFromData(params).then(res => {
        console.log(res)
        const tableList = res.data.payload
        // const tableList =  [
        //   {
        //       "cartype": 3,
        //       "count": 2,
        //       "status": 0
        //   },
        //   {
        //       "cartype": 1,
        //       "count": 4,
        //       "status": 0
        //   },
        //   {
        //       "cartype": 2,
        //       "count": 1,
        //       "status": 0
        //   }
        // ]
        const data = tableList.reduce((pre, current) => {
          const key = `${current.cartype}-${current.status}-count`
          return Object.assign({}, { [key]: current.count }, pre)
        }, {})
        this.tableList = [data]
        this.connectWebsocket()
      })
    },
    setRegions (data) {
      console.log(data.areaInfo, 'setRegions')
      const json = {
        playerid: this.players.map(item => item.id)[0],
        // camera: {
        //   domain: data.serverId,
        //   id:	data.cameraCode
        // },
        type: 1,
        count: 1,
        regions: JSON.parse(data.areaInfo) || []
      }
      // this.regions = JSON.parse(data.areaInfo)
      // console.log(json)
      window.bykj && window.bykj.frameCall('setregions', JSON.stringify(json))
    },
    connectWebsocket() {
      if (this.ws) this.ws.close()
      const host = location.hostname
      const taskId = this.taskId[0].split('-')[0]
      this.ws = new ReconnectingWebSocket(`ws://${host}:9088/v1/wuleiche/${taskId}`, null, {debug: true, reconnectInterval: 3000, timeoutInterval: 15000 })
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      // const detail = evt.data.detial
      const message = evt.data && JSON.parse(evt.data)
      const detail = message.data.detail
      const data = {
        "cartype": detail.cartype,
        event: detail.event,
        collectTime: message.data.time
      }
      const key = `${data.cartype}-${data.event}-count`
      const keys = Object.keys(this.tableList[0])
      keys.forEach(item => {
        if (item === key) {
          this.tableList[0][key] += 1
        } 
      })
      this.vehiclePicList.unshift(detail.file1)
      console.log(this.tableList, this.vehiclePicList)
      // this.tableList = [Object.assign({}, this.tableList[0], detail)]
    },
    getRecentListFromRedis (code) {
      const params = {
        cameraCode : code
      }
      vehicleAPI.getRecentListFromRedis(params).then(res => {
        this.vehiclePicList = res.data.payload.map(item => {
          return JSON.parse(item.fileList)[1]
        }).flat()
      })
    },
    frameRegister () {
      const cxxNotifier = (cmd) => {
        switch (cmd) {
          case 'stopplay':
            this.stopVideo()
            break
          case 'startplay':
            this.stopVideo()
            break
          case 'destroyplayer':
            this.destroyVideo()
            break
          default:
            break
        }
      }
      window.bykj && window.bykj.frameRegister(cxxNotifier);
    },
    createVideo () {
      console.log(this.getPlayers)
      const json = {
        players: this.players
      }
      window.bykj && window.bykj.frameCall('createplayer', JSON.stringify(json))
    },
    startVideo (data) {
      const camera = this.cameraList.find(item => item.cameraCode === data.cameraCodes)
      if (camera) {
        var json = {
          players: [{
            id: this.players.map(item => item.id)[0],
            camera:{
              type: 0,
              domain:  camera.serverId,
              id:	camera.cameraCode,
              level: 0,
            }
          }]
        }
        console.log(json, 'startVideo')
        window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
        this.setRegions(camera)
      }
    },
    stopVideo () {
      var json = {
        players: this.players.map(item => item.id)[0]
      }
      window.bykj && window.bykj.frameCall('stopplay', JSON.stringify(json))
    },
    destroyVideo () {
      var json = {
        players: this.players.map(item => item.id)[0]
      }
      window.bykj && window.bykj.frameCall('destroyplayer', JSON.stringify(json));
    }
  }
}
</script>

<style lang="less" scoped>
#dark {
  .vehicle-monitor {
    background: #21232d;
  }
  .task-list {
    .task-title {
      color: #2dccd3;
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
    }
    .list {
      border: 1px solid #13585c;
    }
  }
  .vehicle-content {
    border: 1px solid #13585c;
    .content-bottom {
      .title {
        color: #2dccd3;
      }
    }
  }
  .vehicle-video {
    border: 1px solid #2dccd3;
  }
  .vehicle-current-list {
    .list {
      .cell {
        border: 1px solid #13585c;
      }
    }
  }
}
#light {
  .vehicle-monitor {
    background: #EBF2FA;
  }
  .task-list {
    .task-title {
      color: #2491F6;
      background: url('../../assets/light-title@2x.png');
      background-size: contain;
    }
    .list {
      background: #fff;
      border: 1px solid #BCD0E3;
    }
  }
  .vehicle-content {
    border: 1px solid #BCD0E3;
    .content-bottom {
      .title {
        color: #2491F6;
      }
    }
  }
  .vehicle-video {
    border: 1px solid #2491F6;
  }
  .vehicle-current-list {
    .title {
      color: #2491F6;
    }
    .list {
      .cell {
        border: 1px solid #2491F6;
      }
    }
  }
}
.vehicle-monitor {
  display: flex;
  box-sizing: border-box;
  padding: 24px;
  height: 100%;
  // background: #21232d;
  overflow: auto;
  .task-list {
    width: 354px;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16Px;
      padding-right: 8px;
    }
    .task-title {
      width: 126px;
      height: 48px;
      margin-bottom: 12px;
      text-align: center;
      line-height: 48px;
      // color: #2dccd3;
      font-size: 16Px;
    }
    .list {
      height: calc(100% - 70px);
      box-sizing: border-box;
      padding: 23px;
      // border: 1px solid #13585c;
    }
  }
  .vehicle-content {
    width: calc(100% - 354px);
    height: calc(100% - 12px);
    margin-left: 24px;
    // border: 1px solid #13585c;
    overflow: hidden;
    .content-main {
      display: flex;
      box-sizing: border-box;
      height: calc(100% - 220px);
      .vehicle-video {
        flex: 1;
        // border: 1px solid #2dccd3;
      }
      .vehicle-current-list {
        width: 266px;
        margin: 0 23px 0 24px;
        .title {
          padding: 10px 0;
          font-size: 18Px;
          line-height: 1;
          color: #fff;
        }
        .list {
          height: 100%;
          padding-top: 10px;
          overflow: auto;
          .cell {
            margin-bottom: 18px;
            // border: 1px solid #13585c;
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .content-bottom {
      padding: 23px;
      height: 220px;
      .title {
        padding: 4px 0 21px 0;
        font-size: 18Px;
        font-weight: 700;
        line-height: 1;
        // color: #2dccd3;
      }
    }
  }
}
</style>
<style lang="less">
.content-bottom {
  .cell {
    font-size: 16Px;
  }
}
// .vehicle-monitor {
//   .el-table th, .el-table tr  {
//     background: #21232d!important;
//     color: #fff;
//   }
//   .el-table tbody tr:hover>td {
//     color: #000;
//     background-color: #a2a4a7!important;
//   }
//   /*table边框颜色*/
//   .el-table--border:after,
//   .el-table--group:after,
//   .el-table:before {
//     background-color: #13585c;
//   }
//   .el-table--border,
//   .el-table--group {
//     border-color: #13585c;
//   }
//   .el-table td,
//   .el-table th.is-leaf {
//     border-bottom: 1px solid #13585c;
//   }

//   .el-table--border th,
//   .el-table--border th.gutter:last-of-type {
//     border-bottom: 1px solid #13585c;
//   }

//   .el-table--border td,
//   .el-table--border th {
//     border-right: 1px solid #13585c;
//   }
//   .el-tree {
//     background: #21232d;
//     color: #fff;
//   }
//   .el-tree-node__content:hover {
//     background: rgba(43, 103, 116, 0.7);
//   }
//   .el-tree-node:focus>.el-tree-node__content {
//     background: rgb(36, 63, 75);
//   }
// }
</style>