<template>
  <div class="sideBar">
    <div class="content">
      <div class="tabs">
        <span :class="['tab', currentTab === 'custom' ? 'selected' : '' ]" @click="selecedTab('custom')">
          客流告警（99+）
        </span>
        <span :class="['tab', currentTab === 'car' ? 'selected' : '' ]" @click="selecedTab('car')">
          五类车告警（99+）
        </span>
      </div>
      <div class="tabContent">
        <ul class="list">
          <li v-for="(message, index) in listData" :key="index">
            <div class="heatMap">
              <img :src="downloadFile(message.data.file)" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="closeMessage(index)">
              </div>
              <div class="other">
                <span>{{message.data.time}}</span>
                <el-button class="btn" size="mini" @click="toDetail(message)">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini" @click="toDetail()">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
              </div>
            </div>
          </li>
          <li>
            <div class="heatMap">
              <img src="" alt="">
            </div>
            <div class="info">
              <div class="text">
                <span>T1航站楼西三指廊客流一级预警</span>
                <img src="../assets/live_icon_close_normal.png" alt="" class="close">
              </div>
              <div class="other">
                <span>12:00:02</span>
                <el-button class="btn" size="mini">查看详情</el-button>
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
      console.log(this.currentTab)
      const path = this.currentTab === 'custom' ? '/psgFlowMonitor' : '/vehicleMonitor'
      this.$router.push(`${path}?data=${message}`)
    },
    selecedTab (type) {
      this.currentTab = type
    },
    connectWebsocket() {
      const ws = new WebSocket('ws://192.168.1.180:9088')
      ws.onmessage = this.getMessage
    },
    getMessage (evt) {
      if (evt.appid === 'renqun') {
        this.peopleData = [].concat(this.peopleData, evt.data)
      } else if (evt.appid === 'carType') {
        this.carData = [].concat(this.carData, evt.data)
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
.sideBar {
  height: 600px;
  box-sizing: border-box;
  background: #272a35;
}
.content {
  height: 100%;
  padding: 25px 5px 25px 23px;
}
.tab {
  display: inline-block;
  width: 191px;
  height: 48px;
  font-size: 18px;
  color: #818d99;
  text-align: center;
  line-height: 48px;
  &:hover {
    cursor: pointer;
  }
}
.tabContent {
  padding: 12px 0;
  height: calc(100% - 150px);
}
.selected {
  color: #2dccd3;
  background: url('../assets/tab_bg@2x.jpg');
  background-size: 100% 100%;
}
.list {
  width: 564px;
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
    .heatMap {
      width: 174px;
      height: 89px;
      margin-right: 12px;
    }
    .info {
      position: relative;
      flex: 1;
      .text {
        color: #fff;
        font-size: 18px;
      }
      .close {
        float: right;
        vertical-align: middle;
      }
      .other {
        position: absolute;
        width: 100%;
        bottom: 0;
        color: #fff;
        span {
          vertical-align: text-bottom; 
        }
        .btn {
          float: right;
        }
      }
    }
  }
}

</style>