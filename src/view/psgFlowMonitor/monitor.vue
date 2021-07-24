<template>
  <div class="flow-monitor">
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
    <div class="content">
      <div class="videoContent">
        <div class="video"></div>
        <div class="heatMap">
          <div class="heatMap-title">热力图</div>
          <img :src="downloadFile(tableData.file)" alt="">
        </div>
      </div>
      <div class="table">
        <el-table :data="[tableData]" border>
          <el-table-column label="当前场景人数" align="center" prop="passengerCount"></el-table-column>
          <template v-for="(area, index) in tableData.areaInfo">
            <el-table-column :label="`区域${index + 1}人数`" align="center" prop="1" :key="area.id">
              <template>
                <span @click="getMessage">{{ area.value }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="区域2人数" align="center" prop="2"></el-table-column>
            <el-table-column label="区域3人数" align="center" prop="3"></el-table-column> -->
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import psgAPI from '@/api/psgAPI'
import groupAPI from '@/api/groupAPI'
import commonAPI from '@/api/commonAPI'
import groupMixins from '@/mixins/groupMixins'
export default {
  mixins: [groupMixins],
  data () {
    return {
      type: 'PSG',
      tableData: [],
      groupList: [],
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
    }
  },
  mounted () {
    this.frameRegister()
    this.getPlayers()
  },
  beforeDestroy () {
    this.destroyVideo()
  },
  methods: {
    getPlayers () {
      const rect = document.querySelector('.video').getBoundingClientRect()
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
      this.createVideo()
    },
    handleNodeClick (data) {
      this.currentCameraCode = data.cameraCode
      if (data.cameraId) {
        this.getList(data)
        this.startVideo(data)
      }
    },
    getList (data) {
      const params = {
        cameraCode: data.cameraCode || 'test01',
        groupId: 2 || data.groupId
      }
      psgAPI.getRealTimeFromRedis(params).then(res => {
        console.log(res)
        const data = res.data.payload
        // const data = {
        // "id": null,
        //   "groupId": null,
        //   "cameraCode": "test01",
        //   "areaInfo": "[{\"id\":\"001\",\"value\":10}]",
        //   "passengerCount": 10,
        //   "collectTime": "2021-07-14T17:00:00.000+0800",
        //   "createBy": null,
        //   "createTime": null,
        //   "updateTime": null,
        //   "updateBy": null,
        //   "remark": null,
        //   "file": "/home/wuleiche/a.jpg"
        // }
        data.areaInfo = JSON.parse(data.areaInfo)
        for (let i = 0; i < data.areaInfo.length; i++) {
          const element = data.areaInfo[i]
          data[i] = element
        }
        console.log(data)
        this.tableData = data
      })
    },
    connectWebsocket() {
      if (this.ws) this.ws.close()
      this.ws = new WebSocket('ws://192.168.1.180:9088')
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      const detail = evt.data.detial
      // const detail = {
      //   "regions":[{
      //     "id":0,
      //     "value":100
      //     },{
      //     "id":1,
      //     "value":100
      //     }],
      //   "value": 200,
      //   "file": "/home/renqun/a.jpg"
      // }
      for (let i = 0; i < detail.regions.length; i++) {
        const element = detail.regions[i]
        detail[i] = element
      }
      detail.passengerCount = detail.value
      detail.areaInfo = detail.regions
      this.tableData = detail
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
        const children = node.data.children
          .concat(data)
          .map(item => {
            if (item.cameraId) item.leaf = true
            return item
          })
        return resolve(children)
      })
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
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    frameRegister () {
      const cxxNotifier = (cmd) => {
        switch (cmd) {
          case 'stoplay':
            this.stopVideo()
            break
          case 'startplay':
            this.startVideo()
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
        players: this.players
      }
      window.bykj && window.bykj.frameCall('createplayer', JSON.stringify(json))
    },
    startVideo (data) {
      var json={
        players: [{
          id: this.players.map(item => item.id)[0],
          camera:{
            type: 0,
            domain: data.serverId,
            id:	data.id,
            level: 0,
          }
        }]
      }
      window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
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
.flow-monitor {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: #21232d;
  .task-list {
    width: 354px;
    flex-shrink: 0;
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
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .list {
      height: calc(100% - 60px);
      box-sizing: border-box;
      padding: 23px;
      border: 1px solid #13585c;
    }
  }
  .content {
    width: calc(100% - 354px);
    height: 100%;
    margin-left: 24px;
    border: 1px solid #13585c;
    overflow: hidden;
    .videoContent {
      display: flex;
      .video,
      .heatMap {
        flex: 1
      }
      .video {
        height: 496px;
        border: 1px solid #2dccd3;
      }
      .heatMap {
        border: 1px solid #13585c;
        .heatMap-title {
          padding: 9px 24px 8px;
          font-size: 18px;
          line-height: 1;
          color: #fff;
        }
        img {
          width: 100%;
        }
      }
    }
    .table {
      padding: 24px;
    }
  }
}
</style>

<style lang="less" scoped>
  // .el-tree {
  //   background: #21232d;
  //   color: #fff;
  // }
  // .el-tree-node__content:hover,
  // .el-tree-node:focus>.el-tree-node__content {
  //   background: #a2a4a7;
  // }
</style>