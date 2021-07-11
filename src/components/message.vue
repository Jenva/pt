<template>
  <div class="sideBar">
    <window-top-title title="消息"></window-top-title>
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
import windowTopTitle from './windowTopTitle.vue'
export default {
  components: {
    windowTopTitle
  },
  data () {
    return {
      currentTab: 'custom'
    }
  },
  mounted () {
    this.connectWebsocket()
  },
  methods: {
    selecedTab (type) {
      this.currentTab = type
    },
    connectWebsocket() {
      const websocket = new WebSocket('ws://192.168.1.180:9088')
      console.log(websocket)
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