<template>
  <div class="message-sideBar">
    <div class="message-content">
      <div class="message-tabs">
        <span :class="['message-tab', currentTab === 'custom' ? 'selected' : '' ]" @click="selecedTab('custom')">
          客流告警（{{peopleData.length > 99 ? '99+' : peopleData.length}}）
        </span>
        <span :class="['message-tab', currentTab === 'car' ? 'selected' : '' ]" @click="selecedTab('car')">
          五类车告警（{{carData.length > 99 ? '99+' : carData.length}}）
        </span>
      </div>
      <div class="message-tabContent">
        <ul class="message-list" >
          <li v-for="(message, index) in listData" :key="index">
            <div class="message-heatMap">
              <img :src="downloadFile(message.file)" alt="">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage(index)">
              </div>
              <div class="message-title">{{message.taskname}}</div>
              <div class="message-other">
                <span class="message-text">{{message.time}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail(message)">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-title">任务五二五问吴经理开软件</div>
              <div class="message-other">
                <span class="message-text">{{'2021-07-21 12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-close">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import commonAPI from '@/api/commonAPI'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  data () {
    return {
      currentTab: 'custom',
      peopleData: [],
      carData: [],
      ws: ''
    }
  },
  computed: {
    listData () {
      return this.currentTab === 'custom' ? this.peopleData : this.carData
    }
  },
  mounted () {
    this.connectWebsocket()
    this.changeMode()
  },
  beforeDestroy () {
    this.ws.close()
  },
  methods: {
    changeMode () {
      const type = /dark/.test(this.$route.query.type)
      const dom = document.body
      dom.id = 'light'
      if (type) {
        dom.id = 'dark'
      }
    },
    toDetail (message) {
      const path = this.currentTab === 'custom' ? '/psgFlowMonitor' : '/vehicleMonitor'
      const name = this.currentTab === 'custom' ? '客流监控' : '五类车监控'
      window.bykj.frameCall('newwindow', JSON.stringify({url: `${path}?data=${JSON.stringify(message)}`, name}))
      // const data = {
      //   camera: '10.133.7.140'
      // }
      // this.$router.push(`${path}?data=${JSON.stringify(data)}`)
    },
    selecedTab (type) {
      this.currentTab = type
    },
    connectWebsocket() {
      const host = location.hostname
      this.ws = new ReconnectingWebSocket(`ws://${host}:9088/v1`, null, {debug: true, reconnectInterval: 3000, timeoutInterval: 15000 })
      // const ws = new WebSocket(`ws://${host}:9088/v1`)
      this.ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      console.log(evt)
      const message = evt.data && JSON.parse(evt.data)
      message.data.taskname = message.taskname
      Object.keys(message.data.detail).forEach(key => {
        message.data[key] = message.data.detail[key]
      })
      delete message.data.detail
      if (message.appid === 'renqun') {
        this.peopleData = [].concat([message.data], this.peopleData)
      } else if (message.appid === 'wuleiche') {
        message.data.file = message.data.file0
        this.carData = [].concat([message.data], this.carData)
      }
    },
    downloadFile (id) {
      return commonAPI.downloadFile(id)
    },
    closeMessage (index) {
      this.listData.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
#dark {
  .message-sideBar {
    background: #272a35;
  }
  .message-tab {
    color: #818d99;
  }
  .selected {
    color: #2dccd3;
    background: url('../assets/tab_bg@2x.jpg');
    background-size: 100% 100%;
    }
  .message-list {
    li {
      border: 1px solid #13585c;
    }
  }
  .message-info {
    position: relative;
    flex: 1;
    .message-text {
      color: #fff;
    }
    .message-title {
      color: #fff;
    }
    .message-close {
      color: #fff;
    }
    .message-other {
      color: #fff;
    }
  }
}
#light {
  .message-sideBar {
    background: #EBF2FA;
  }
  .message-tab {
    color: #818d99;
  }
  .selected {
    color: #2491F6;
    background: url('../assets/message-tab@2x.png');
    background-size: 100% 100%;
  }
  .message-list {
    li {
      border: 1px solid #2491F6;
    }
  }
  .message-info {
    .message-text {
      color: #2491F6;
    }
    .message-title {
      color: #2491F6;
    }
    .message-close {
      color: #2491F6;
    }
    .message-other {
      color: #2491F6;
    }
  }
}
.message-sideBar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // background: #272a35;
}
.message-content {
  width: 99%;
  height: calc(100% - 20px);
  padding: 10px 5px 10px 10px;
  box-sizing: border-box;
}
.message-tab {
  display: inline-block;
  width: 40%;
  height: 48px;
  max-width: 178px;
  font-size: 16px;
  // color: #818d99;
  text-align: center;
  line-height: 48px;
  &:hover {
    cursor: pointer;
  }
}
.message-tabContent {
  padding: 12px 0;
  height: calc(100% - 48px);
  overflow-y: auto;
}
.selected {
  color: #2dccd3;
  background: url('../assets/tab_bg@2x.jpg');
  background-size: 100% 100%;
}
.message-list {
  width: calc(100% - 10px);
  padding-right: 10px;
  /*修改滚动条样式*/
  &::-webkit-scrollbar{
    width:8Px;
    height:10Px;
  }
  &::-webkit-scrollbar-track{
    background: #272a35;
    border-radius:2Px;
  }
  &::-webkit-scrollbar-thumb{
    background: #99a8b6;
    border-radius:10Px;
  }
  &::-webkit-scrollbar-thumb:hover{
    background: #616b74;
  }
  &::-webkit-scrollbar-corner{
    background: #179a16;
  }
  li {
    display: flex;
    padding: 11px;
    margin-bottom: 12px;
    // border: 1px solid #13585c;
    .message-heatMap {
      width: 100px;
      height: 50px;
      margin-right: 12px;
      img {
        width: 100%;
        height: 100%
      }
    }
    .message-info {
      position: relative;
      flex: 1;
      .message-text {
        // color: #fff;
        font-size: 14px;
      }
      .message-title {
        // color: #fff;
        font-size: 14px;
      }
      .message-close {
        // color: #fff;
        font-size: 18px;
        cursor: pointer;
      }
      .close {
        float: right;
        vertical-align: middle;
      }
      .message-other {
        position: absolute;
        width: 100%;
        bottom: 0;
        // color: #fff;
        span {
          vertical-align: -webkit-baseline-middle; 
        }
        .message-btn {
          float: right;
          width: 70px;
          height: 25px;
          font-size: 14px;
        }
      }
    }
  }
}

</style>