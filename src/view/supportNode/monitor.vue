<template>
  <div class="flow-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList" :props="defaultProps" @node-click="handleNodeClick" :load="loadNode" lazy>
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="content">
      <div class="videoContent">
        <div class="main-video">
          <div class="main-video-title">T1航站楼 A区问询处</div>
        </div>
        <div class="second-video">
          <div class="second-video-title">T1航站楼 F区自助值机区</div>
        </div>
      </div>
      <div class="node-chart">

      </div>
    </div>
  </div>
</template>

<script>
import psgAPI from '@/api/psgAPI'
// import groupAPI from '@/api/groupAPI'
import taskAPI from '@/api/taskAPI'
import commonAPI from '@/api/commonAPI'
import groupMixins from '@/mixins/groupMixins'
export default {
  mixins: [groupMixins],
  data () {
    return {
      type: 'PSG',
      tableData: [],
      players: [],
      groupList: [],
      listId: 0,
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
    }
  },
  mounted () {
    this.frameRegister()
    this.getPlayers(true)
    this.resize()
  },
  beforeDestroy () {
    this.destroyVideo()
  },
  methods: {
    getPlayers (isMounted) {
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
    handleNodeClick (data) {
      if (data.cameraCodes) {
        this.currentCameraCode = data.cameraCodes[0]
        this.getList(data)
        this.startVideo(data)
        this.loop(data)
      }
    },
    getList (data) {
      const params = {
        cameraCode: data.cameraCodes[0] || 'test01',
        groupId: data.groupId
      }
      psgAPI.getRealTimeFromRedis(params).then(res => {
        const data = res.data.payload
        data.areaInfo = JSON.parse(data.areaInfo)
        for (let i = 0; i < data.areaInfo.length; i++) {
          const element = data.areaInfo[i]
          data[i] = element
        }
        console.log(data)
        this.tableData = data
      })
    },
    loop (data) {
      clearInterval(this.listId)
      this.listId = setInterval(() => {
        // this.getList({ cameraCodes: [this.currentCameraCode], groupId: this.groupId })
        this.getList(data)
      }, 5000)
    },
    connectWebsocket() {
      if (this.ws) this.ws.close()
      this.ws = new WebSocket('ws://192.168.1.180:9088')
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      const detail = evt.data.detial
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
      this.getTaskList(node.data, (data) => {
        if (!node.data.children) node.data.children = []
        const children = node.data.children
          .concat(data)
          .map(item => {
            if (item.taskType) item.leaf = true
            return item
          })
        return resolve(children)
      })
    },
    getTaskList (data, cb) {
      const params = {
        groupId: data.id,
        taskType: 'PASSENGER'
      }
      taskAPI.getTaskPageList(0, 100, params).then(res => {
        cb(res.data.payload.rows)
      })
    },
    getCamera (data, cb) {
      const params = {
        code: data.cameraCodes[0]
      }
      commonAPI.getCameraList(params).then(res => {
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
      this.getCamera(data, (payload) => {
        var json={
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
      height: 48Px;
      margin-bottom: 12px;
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
      text-align: center;
      line-height: 48Px;
      color: #2dccd3;
      font-size: 16Px;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16Px;
      padding-right: 8px;
    }
    .list {
      height: calc(100% - 50Px);
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
      .main-video,
      .second-video {
        flex: 1
      }
      .main-video {
        height: 496px;
        border: 1px solid #2dccd3;
        .main-video-title {
          padding: 9px 24px 8px;
          font-size: 18Px;
          line-height: 1;
          color: #fff;
        }
      }
      .second-video {
        border: 1px solid #13585c;
        .second-video-title {
          padding: 9px 24px 8px;
          font-size: 18Px;
          line-height: 1;
          color: #fff;
        }
        img {
          width: 100%;
        }
      }
    }
    .node-chart {
      height: 400Px;
      padding: 24px;
      background: url('../../assets/supportNode.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>

<style lang="less" scoped>
.flow-monitor {
  .cell {
    font-size: 16Px;
  }
}
  // .el-tree {
  //   background: #21232d;
  //   color: #fff;
  // }
  // .el-tree-node__content:hover,
  // .el-tree-node:focus>.el-tree-node__content {
  //   background: #a2a4a7;
  // }
</style>