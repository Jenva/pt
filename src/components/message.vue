<template>
  <div class="message-sideBar">
    <div class="message-content">
      <div class="message-tabs">
        <span :class="['message-tab', currentTab === 'custom' ? 'selected' : '' ]" @click="selecedTab('custom')">
          客流告警（{{peopleData.length}}）
        </span>
        <span :class="['message-tab', currentTab === 'car' ? 'selected' : '' ]" @click="selecedTab('car')">
          五类车告警（{{carData.length}}）
        </span>
      </div>
      <div class="message-tabContent">
        <ul class="message-list" >
          <li v-for="(message, index) in listData" :key="index">
            <div class="message-heatMap">
              <img :src="downloadFile(message.file)" alt="">
            </div>
            <div class="message-info">
              <div class="message-text">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage(index)">
              </div>
              <div class="message-other">
                <span class="message-text">{{message.time}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail(message)">查看详情</el-button>
              </div>
            </div>
          </li>
          <!-- <li>
            <div class="message-heatMap">
            </div>
            <div class="message-info">
              <div class="message-text">
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
              <div class="message-text">
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
              <div class="message-text">
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
              <div class="message-text">
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
              <div class="message-text">
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
              <div class="message-text">
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
              <div class="message-text">
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage">
              </div>
              <div class="message-other">
                <span class="message-text">{{'12:00:00'}}</span>
                <el-button class="message-btn" size="mini" @click="toDetail">查看详情</el-button>
              </div>
            </div>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import commonAPI from '@/api/commonAPI'
export default {
  data () {
    return {
      currentTab: 'custom',
      peopleData: [],
      carData: []
    }
  },
  computed: {
    listData () {
      return this.currentTab === 'custom' ? this.peopleData : this.carData
    }
  },
  mounted () {
    this.connectWebsocket()
  },
  methods: {
    toDetail (message) {
      const path = this.currentTab === 'custom' ? '/#/psgFlowMonitor' : '/#/vehicleMonitor'
      const name = this.currentTab === 'custom' ? '客流监控' : '五类车监控'
      window.bykj.frameCall('newwindow', JSON.stringify({url: `${path}?data=${message}`, name}))
      // this.$router.push(`${path}?data=${message}`)
    },
    selecedTab (type) {
      this.currentTab = type
    },
    connectWebsocket() {
      const ws = new WebSocket('ws://10.10.220.141:9088')
      ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      console.log(evt)
      if (evt.appid === 'renqun') {
        Object.keys(evt.data.detail).forEach(key => {
          evt.data[key] = evt.data.detail[key]
        })
        this.peopleData = [].concat(this.peopleData, [evt.data])
      } else if (evt.appid === 'wuleiche') {
        evt.data.file = evt.data.file0
        this.carData = [].concat(this.carData, [evt.data])
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
.message-sideBar {
  width: 100%;
  // height: 100%;
  box-sizing: border-box;
  background: #272a35;
}
.message-content {
  height: 100%;
  padding: 10px 5px 10px 10px;
  box-sizing: border-box;
}
.message-tab {
  display: inline-block;
  width: 40%;
  height: 48px;
  font-size: 16px;
  color: #818d99;
  text-align: center;
  line-height: 48px;
  &:hover {
    cursor: pointer;
  }
}
.messge-abContent {
  padding: 12px 0;
  height: calc(100% - 48px);
}
.selected {
  color: #2dccd3;
  background: url('../assets/tab_bg@2x.jpg');
  background-size: 100% 100%;
}
.message-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-right: 10px;
  /*修改滚动条样式*/
  &::-webkit-scrollbar{
    width:8px;
    height:10px;
    /**/
  }
  &::-webkit-scrollbar-track{
    background: #272a35;
    border-radius:2px;
  }
  &::-webkit-scrollbar-thumb{
    background: #99a8b6;
    border-radius:10px;
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
    border: 1px solid #13585c;
    .message-heatMap {
      width: 100px;
      height: 50px;
      margin-right: 12px;
    }
    .message-info {
      position: relative;
      flex: 1;
      .message-text {
        color: #fff;
        font-size: 18px;
      }
      .close {
        float: right;
        vertical-align: middle;
      }
      .message-other {
        position: absolute;
        width: 100%;
        bottom: 0;
        color: #fff;
        span {
          vertical-align: text-bottom; 
        }
        .message-btn {
          float: right;
          width: 90px;
          height: 25px;
          font-size: 14px;
        }
      }
    }
  }
}

</style>