<template>
  <div class="flow-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList[0] && groupList[0].children" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="taskId" node-key="id">
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="content">
      <div class="videoContent">
        <div class="video"></div>
        <div class="heatMap">
          <!-- <div class="heatMap-title">热力图</div> -->
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
// import taskAPI from '@/api/taskAPI'
import commonAPI from '@/api/commonAPI'
import groupMixins from '@/mixins/groupMixins'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  mixins: [groupMixins],
  data () {
    return {
      type: 'PSG',
      tableData: [],
      players: [],
      groupList: [],
      taskList: [],
      groupId: '',
      listId: 0,
      taskType: 'PASSENGER',
      taskId: [],
      cameraList: [],
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
    }
  },
  watch: {
    taskList () {
      this.getCamera()
    }
  },
  mounted () {
    this.frameRegister()
    this.getPlayers(true)
    this.resize()
  },
  beforeDestroy () {
    this.destroyVideo()
    // clearInterval(this.listId)
    if (this.ws) this.ws.close()
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
    autoPlay () {
      const params = this.$route.query.data
      if (params) {
        const data = JSON.parse(params)
        this.getTaskId(data.camera)
        const ids = this.taskList
          .find(item => item.cameraCodes === data.camera)
        this.currentCameraCode = data.camera
        this.taskId = [ids.id]
        data.groupId = ids.groupId
        data.cameraCodes = data.camera
        this.getList(data)
        this.startVideo({cameraCodes: data.camera})
      }
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
        this.currentCameraCode = data.cameraCodes
        this.getTaskId(this.currentCameraCode)
        this.getList(data)
        this.startVideo(data)
      }
    },
    getTaskId (camera) {
      const ids = this.taskList.find(item => item.cameraCodes.includes(camera))
      this.taskId = [ids.id]
    },
    getList (data) {
      const params = {
        cameraCode: data.cameraCodes,
        groupId: data.groupId
      }
      psgAPI.getRealTimeFromRedis(params).then(res => {
        const data = res.data.payload
        if (data) {
          data.areaInfo = JSON.parse(data.areaInfo)
          for (let i = 0; i < data.areaInfo.length; i++) {
            const element = data.areaInfo[i]
            data[i] = element
          }
          console.log(data)
          this.tableData = data
        }
        this.connectWebsocket()
      })
    },
    loop (data) {
      clearInterval(this.listId)
      this.listId = setInterval(() => {
        this.getList(data)
      }, 5000)
    },
    connectWebsocket() {
      if (this.ws) this.ws.close()
      const host = location.hostname
      const taskId = this.taskId[0].split('-')[0]
      this.ws = new ReconnectingWebSocket(`ws://${host}:9088/v1/renqun/${taskId}`, null, {debug: true, reconnectInterval: 3000, timeoutInterval: 15000 })
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      const message = evt.data && JSON.parse(evt.data)
      const detail = message.data.detail
      // const data = {}
      // for (let i = 0; i < detail.regions.length; i++) {
      //   const element = detail.regions[i]
      //   detail[i] = element
      // }
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
    getCamera () {
      groupAPI.getCameraListByGroupId().then(res => {
        this.cameraList = res.data.payload
        console.log(this.cameraList)
        this.autoPlay()
      })
    },
    setRegions (data) {
      const json = {
        playerid: this.players.map(item => item.id)[0],
        type: 1,
        count: 1,
        regions: (data.areaInfo && JSON.parse(data.areaInfo)) || []
      }
      window.bykj && window.bykj.frameCall('setregions', JSON.stringify(json))
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
      const camera = this.cameraList.find(item => item.cameraCode === data.cameraCodes)
      if (camera) {
        var json = {
          players: [{
            id: this.players.map(item => item.id)[0],
            camera:{
              type: 0,
              domain: camera.serverId,
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
  .flow-monitor {
    background: #21232d;
  }
  .task-list {
    .task-title {
      color: #2dccd3;
    }
    .list {
      border: 1px solid #13585c;
    }
  }
  .content {
    border: 1px solid #13585c;
    .videoContent {
      .video {
        border: 1px solid #2dccd3;
      }
      .heatMap {
        border: 1px solid #13585c;
        .heatMap-title {
          color: #fff;
        }
      }
    }
  }
}
#light {
  .flow-monitor {
    background: #EBF2FA;
  }
  .task-list {
    .task-title {
      color: #2491F6;
    }
    .list {
      border: 1px solid #BCD0E3;
      background: #fff;
    }
  }
  .content {
    border: 1px solid #BCD0E3;
    .videoContent {
      .video {
        border: 1px solid #2491F6;
      }
      .heatMap {
        border: 1px solid #2491F6;
        .heatMap-title {
          color: #2491F6;
        }
      }
    }
  }
}
.flow-monitor {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  // background: #21232d;
  .task-list {
    width: 354px;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    .task-title {
      width: 126px;
      height: 48Px;
      margin-bottom: 12px;
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
      text-align: center;
      line-height: 48Px;
      // color: #2dccd3;
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
      min-height: calc(100% - 60Px);
      box-sizing: border-box;
      padding: 23px;
      // border: 1px solid #13585c;
    }
  }
  .content {
    width: calc(100% - 354px);
    height: 100%;
    margin-left: 24px;
    // border: 1px solid #13585c;
    overflow: hidden;
    .videoContent {
      display: flex;
      .video,
      .heatMap {
        flex: 1
      }
      .video {
        height: 496px;
        // border: 1px solid #2dccd3;
      }
      .heatMap {
        // border: 1px solid #13585c;
        .heatMap-title {
          padding: 9px 24px 8px;
          font-size: 18Px;
          line-height: 1;
          // color: #fff;
        }
        img {
          width: 100%;
          height: 100%
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