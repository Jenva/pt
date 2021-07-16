<template>
  <div class="vehicle-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList" :props="defaultProps" @node-click="handleNodeClick" :load="loadNode" lazy>
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
            <span>
              <el-tag v-if="data.cameraId" size="mini">视频枪</el-tag>
              <el-tag v-else type="success" size="mini">组/区域</el-tag>
            </span>
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
          <el-table :data="emptyData" style="width: 100%">
            <template v-for="(list) in tableList">
              <el-table-column :label="`${getDisplayDict(list[0], carTypeDict)}`" width="240" align="center" :key="list[0]">
                <el-table-column :label="`${getDisplayDict(carData.status, carEntranceType)}`" width="80" align="center" prop="enter" v-for="(carData, index) in list[1]" :key="carData.cartype+index">
                  <template slot-scope>
                    <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ carData.count }}</a>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
                <!-- <el-table-column label="离开" width="80" align="center" prop="leave">
                  <template slot-scope="scope">
                    <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                  </template>
                </el-table-column>
                <el-table-column label="存量" width="80" align="center" prop="save">
                  <template slot-scope="scope">
                    <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
            <el-table-column label="公交车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="三轮车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="自行车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="卡车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="摩托车" width="240" align="center">
              <el-table-column label="进入" width="80" align="center" prop="enter">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="离开" width="80" align="center" prop="leave">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
              <el-table-column label="存量" width="80" align="center" prop="save">
                <template slot-scope="scope">
                  <a href="javascrpit:;" @click="toDetail" style="color: #fff">{{ scope.row.enter }}</a>
                </template>
              </el-table-column>
            </el-table-column> -->
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
      picList: [],
      tableList: [
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      carTypeDict: [],
      carEntranceType: [],
      type: '0-CAR',
      vehiclePicList: [],
      emptyData: [],
      players: []
    }
  },
  beforeDestroy () {
    this.destroyVideo()
  },
  mounted () {
    this.resize()
    this.getPlayers()
    this.getDict('CAR_TYPE', 'carTypeDict')
    this.getDict('CAR_ENTRANCE_TYPE', 'carEntranceType')
  },
  methods: {
    getPlayers () {
      const rect = document.querySelector('.vehicle-video').getBoundingClientRect()
      var players =  [
        { 
          id: '1',
          x: rect.left - 20,
          y: rect.top,
          w: rect.width + 20,
          h: rect.height
        }
      ]
      this.players = players
      this.createVideo()
      console.log(players)
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
      const params = {
        'createTime_gt': dayjs().format('YYYY-MM-DD 00:00:00'),
        areaCode : this.currentCameraCode || 'D3C01'
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
    },
    handleNodeClick (data) {
      this.currentCameraCode = data.cameraCode
      if (data.cameraId) {
        this.getStatFromData(data.cameraCode || 'D3C01')
        this.getRecentListFromRedis(data.cameraCode || 'D3C01')
        this.startVideo(data)
      }
    },
    getCameraByGroupId (data, cb) {
      const params = {
        groupId: data.id
      }
      groupAPI.getCameraListByGroupId(params).then(res => {
        res.data.payload.forEach(item => {
          item.name = item.cameraName || '视频枪' + item.id
        })
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
      this.getCameraByGroupId(node.data, (data) => {
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
        areaCode : code
      }
      vehicleAPI.getStatFromData(params).then(res => {
        const tableList = res.data.payload
        const map = new Map()
        for (let i = 0; i < tableList.length; i++) {
          const element = tableList[i]
          if (map.has(element.cartype)) {
            console.log(map.get(element.cartype))
            map.set(element.cartype, [...map.get(element.cartype), element])
          } else {
            map.set(element.cartype, [element])
          }
        }
        this.tableList = [...map.entries()]
        this.emptyData = [{}]
      })
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
      const json = {
        players: this.getPlayers
      }
      window.bykj && window.bykj.frameCall('createplayer', JSON.stringify(json))
    },
    startVideo (data) {
      var json={
        players: [{
          id: this.players(item => item.id)[0],
          camera:{
            type: data.type,
            domain:  data.serverId,
            id:	data.id,
            level: 0,
          }
        }]
      }
      window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
    },
    stopVideo () {
      var json = {
        players: this.players(item => item.id)[0]
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
      font-size: 14px;
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
    }
    .list {
      height: 860px;
      box-sizing: border-box;
      padding: 23px;
      border: 1px solid #13585c;
    }
  }
  .vehicle-content {
    width: calc(100% - 354px);
    height: 905px;
    margin-left: 24px;
    padding-bottom: 13px;
    border: 1px solid #13585c;
    .content-main {
      display: flex;
      box-sizing: border-box;
      height: 638px;
      .vehicle-video {
        flex: 1;
        border: 1px solid #2dccd3;
      }
      .vehicle-current-list {
        width: 266px;
        margin: 0 23px 0 24px;
        .title {
          padding: 10px 0;
          font-size: 18px;
          line-height: 1;
          color: #fff;
        }
        .list {
          height: calc(100% - 48px);
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
      .title {
        padding: 4px 0 21px 0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
        color: #2dccd3;
      }
    }
  }
}
</style>
<style lang="less">
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