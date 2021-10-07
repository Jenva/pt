<template>
  <div class="flow-monitor">
    <div class="task-list">
      <div class="task-title">任务列表</div>
      <div class="list">
        <el-tree :data="groupList" :props="defaultProps" @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="content">
      <div class="videoContent">
        <div :class="[`${num}-video`, 'main-video']" v-for="num in 16" :key="num">
        </div>
      </div>
      <div class="node-chart">
        <div class="node-title">
          <span>航班号: {{ standData.flightNo  }}</span>
          <span>机型: {{ standData.craftType  }}</span>
          <span>机位: {{ standData.craftNo  }}</span>
          <span>实际保障时间: {{ standData. LocalDateTime   }}</span>
          <span>计划过站时间: {{ standData.planDepTime  }}</span>
          <span>航线: {{ standData.flightLine  }}</span>
          <span>代理公司: {{ standData.flightLine  }}</span>
        </div>
        <div class="node-chart-stand">
          <span v-for="node in nodeList" :key="node.detailValue">
            <div :class="['node-chart-stand-text', {'line-height': node.detailValue === String(currentStand)}]">
              {{node.detailName }}
            </div>
          </span>
          <!-- <span v-for="node in nodeList" :key="node.detailValue">{{ node.detailName }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import flightAPI from '@/api/flightAPI'
import taskAPI from '@/api/taskAPI'
import commonAPI from '@/api/commonAPI'
// import groupMixins from '@/mixins/groupMixins'
export default {
  // mixins: [groupMixins],
  data () {
    return {
      type: 'PSG',
      tableData: [],
      players: [],
      groupList: [],
      standData: {},
      listId: 0,
      currentStand: 0,
      nodeList: {},
      defaultProps: {
        label: 'label',
        children: 'children',
        isLeaf: 'leaf'
      },
    }
  },
  mounted () {
    this.getDict()
    this.getFlightGroupList()
    this.getPlayers(true)
    this.resize()
  },
  beforeDestroy () {
    this.destroyVideo()
  },
  methods: {
    getPlayers (isMounted) {
      const main = document.querySelectorAll('.main-video')
      var players =  []
      main.forEach((item, index) => {
        const clientRect = item.getBoundingClientRect()
        players.push({
          id: index + 1,
          x: clientRect.left,
          y: clientRect.top,
          w: clientRect.width,
          h: clientRect.height
        })
      })
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
      if (data.standId) {
        this.startVideo(data)
        this.getByFlightStand(data.standId)
        this.connectWebsocket(data.standId)
      }
    },
    getDict () {
      const params = {
        dictValue: 'AIRCRAFT_NODE'
      }
      commonAPI.getDictByValue(params).then(res => {
        this.nodeList = res.data.payload
        this.nodeList.reverse()
      })
    },
    getFlightGroupList () {
      flightAPI.flightGroup().then(res => {
        const groupList = []
        res.data.payload.forEach(data => {
          const cameraConfig = data.config && JSON.parse(data.config).streamlist.map(item => item.stream)
          const gruop = {
            groupId: data.group_id,
            name: data.name,
            standId: data.stand_id,
            cameraConfig: cameraConfig
          }
          groupList.push(gruop)
        })
        this.groupList = groupList
      })
    },
    connectWebsocket(standId) {
      if (this.ws) this.ws.close()
      const host = location.hostname
      this.ws = new WebSocket(`ws://${host}:9088/v1/baozhang/${standId}`)
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      const message = evt.data && JSON.parse(evt.data)
      this.currentStand = message.data.event
    },
    getByFlightStand (standId) {
      flightAPI.getByFlightStand({ depLoc: standId }).then(res => {
        console.log(res)
        this.standData = res.data.payload
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
    createVideo () {
      const json = {
        players: this.players
      }
      window.bykj && window.bykj.frameCall('createplayer', JSON.stringify(json))
      window.bykj.frameCall('hideplayer', JSON.stringify({type: 'all'}))
    },
    startVideo (data) {
      const players = []
      this.players.forEach((item, index) => {
        if (data.cameraConfig[index]) {
          players.push({
            id: item.id,
            camera:{
              type: 0,
              domain:  data.cameraConfig[index].domain,
              id: data.cameraConfig[index].camera,
              level: 0
            }
          })
        }
      })
        var json = {
          players: players
        }
        console.log(json)
        window.bykj && window.bykj.frameCall('showplayer', JSON.stringify({type: 'all'}))
        window.bykj && window.bykj.frameCall('startplay', JSON.stringify(json))
    },
    stopVideo () {
      var json = {
        players: this.players.map(item => ({id: item.id}))[0]
      }
      window.bykj && window.bykj.frameCall('stopplay', JSON.stringify(json))
    },
    destroyVideo () {
      var json = {
        players: this.players.map(item => ({id: item.id}))[0]
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
      height: calc(100% - 400px);
      overflow: hidden;
      flex-wrap: wrap;
      .main-video,
      .second-video {
        width: 24.9%;
        &:nth-child(n) {
          border-right: 1px solid #2dccd3;
          border-bottom: 1px solid #2dccd3;
        }
        &:nth-child(4n) {
          border-right: none;
        }
        &:nth-child(n + 13) {
          border-bottom: none;
        }
      }
      .main-video {
        // border: 1px solid #2dccd3;
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
      height: 400px;
      // padding: 24px;
      // background: url('../../assets/supportNode.png') no-repeat;
      // background-size: 100% 100%;
      .node-title {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        font-size: 16px;
        color: #fff;
        background: #13585c;
      }
      .node-chart-stand {
        padding: 0 20px;
        line-height: 400px;
        span {
          position: relative;
          display: inline-block;
          width: 96px;
          height: 68px;
          line-height: 1.5;
          background: url('../../assets/cell_2@3x.png');
          background-size: 100% 100%;
          img {
            width: 100%;
            height: 100%;
          }
          .node-chart-stand-text {
            line-height: 88px;
            text-align: center;
            color: #fff;
            font-size: 14px;
          }
          .line-height {
            color: #ff0000
          }
        }
      }
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