<template>
  <div class="vehicle-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="taskId" node-key="id">
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
        <div class="title">今日0点至今五类车进出统计表</div>
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
                      <a @click="toDetail" style="color: #fff;cursor: pointer;">
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
import dayjs from 'dayjs'
export default {
  mixins: [groupMixins],
  components: {previewPic},
  data () {
    return {
      showPreview: false,
      currentCameraCode: 0,
      recentPicId: 0,
      statId: 0,
      picList: [],
      taskList: [],
      taskId: ['6-9'],
      tableList: [
        // { '3-1-count': 10 }
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
      players: [],
      ws: ''
    }
  },
  created () {
    // this.getData()
  },
  beforeDestroy () {
    this.destroyVideo()
    clearInterval(this.recentPicId)
    clearInterval(this.statId)
  },
  mounted () {
    this.resize()
    this.getPlayers(1)
    this.getDict('CAR_TYPE', 'carTypeDict')
    this.getDict('CAR_ENTRANCE_TYPE', 'carEntranceType')
    const params = this.$route.query.params
    if (params) {
      const data = JSON.parse(params)
      this.currentCameraCode = data.camera
      this.getStatFromData(data.camera)
      this.getRecentListFromRedis(data.camera)
      this.loopMethod()
      const ids = this.taskList.forEach(item => item.cameraCodes.includes(params.camera))
      this.taskId = [ids.id]
    }
  },
  methods: {
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
    toDetail () {
      this.showPreview = true
      window.bykj.frameCall('hideplayer', JSON.stringify({type: 'all'}))
      const params = {
        'createTime_gt': dayjs().format('YYYY-MM-DD 00:00:00'),
        areaCode: this.currentCameraCode || 'D3C01'
      }
      vehicleAPI.getStatDetailList(params).then(res => {
        console.log(res)
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
        this.currentCameraCode = data.cameraCodes[0]
        this.getStatFromData(data.cameraCodes[0] || 'D3C01')
        this.getRecentListFromRedis(data.cameraCodes[0] || 'D3C01')
        this.startVideo(data)
        this.loopMethod()
      }
    },
    getTaskList (data, cb) {
        const params = {
        groupId: data.id
      }
      taskAPI.getTaskPageList(0, 100, params).then(res => {
        cb(res.data.payload.rows)
      })
    },
    getCamera (data, cb) {
      const params = {
        cameraCode: data.cameraCodes[0]
      }
      // commonAPI.getCameraList(params).then(res => {
      groupAPI.getCameraList(params).then(res => {
        const cameraList = res.data.payload
        cb(cameraList)
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
        // this.connectWebsocket()
      })
    },
    setRegions (data) {
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
      this.ws = new WebSocket('ws://192.168.1.180:9088')
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      const detail = evt.data.detial
      // const detail = {
      //   "cartype": 3,
      //   "count": 2,
      //   "status": 0
      // }
      const key = `${detail.cartype}-${detail.status}-count`
      detail[key] = detail.count
      this.tableList = [Object.assign({}, this.tableList[0], detail)]
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
      this.getCamera(data, (payload) => {
        var json = {
          players: [{
            id: this.players.map(item => item.id)[0],
            camera:{
              type: 0,
              domain:  payload[0].serverId,
              id:	payload[0].code,
              level: 0,
            }
          }]
        }
        console.log(json)
        window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
        this.setRegions(payload[0])
      })
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
.vehicle-monitor {
  display: flex;
  box-sizing: border-box;
  padding: 24px;
  height: 100%;
  background: #21232d;
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
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
      text-align: center;
      line-height: 48px;
      color: #2dccd3;
      font-size: 16Px;
    }
    .list {
      height: calc(100% - 70px);
      box-sizing: border-box;
      padding: 23px;
      border: 1px solid #13585c;
    }
  }
  .vehicle-content {
    width: calc(100% - 354px);
    height: calc(100% - 12px);
    margin-left: 24px;
    // padding-bottom: 13px;
    border: 1px solid #13585c;
    overflow: hidden;
    .content-main {
      display: flex;
      box-sizing: border-box;
      height: calc(100% - 220px);
      .vehicle-video {
        flex: 1;
        border: 1px solid #2dccd3;
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
            border: 1px solid #13585c;
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
        color: #2dccd3;
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
.vehicle-monitor {
  .el-table th, .el-table tr  {
    background: #21232d!important;
    color: #fff;
  }
  .el-table tbody tr:hover>td {
    color: #000;
    background-color: #a2a4a7!important;
  }
  /*table边框颜色*/
  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #13585c;
  }
  .el-table--border,
  .el-table--group {
    border-color: #13585c;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #13585c;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #13585c;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #13585c;
  }
  .el-tree {
    background: #21232d;
    color: #fff;
  }
  .el-tree-node__content:hover,
  .el-tree-node:focus>.el-tree-node__content {
    background: #a2a4a7;
  }
}
</style>