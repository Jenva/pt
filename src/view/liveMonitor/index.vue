<template>
  <div class="live-monitor">
    <div class="live-monitor-contnet">
      <div class="live-monitor-list">
        <div class="list-title">摄像机</div>
        <div class="list">
          <el-tree :defaultProps="defaultProps" :data="list"></el-tree>
        </div>
      </div>
      <div class="live-monitor-video">
        <div class="video-left-top"></div>
        <div class="video-right-top"></div>
        <div class="video-left-bottom"></div>
        <!-- <div class="video-right-bottom"></div> -->
      </div>
    </div>
    <el-button circle class="circle" @click="showMessage" type="goon">
      <img src="../../assets/live_icon_closemessage_click.png" alt="" v-if="show">
      <img src="../../assets/live_icon_news_normal.png" alt="" v-else>
    </el-button>
    <message class="message" v-if="show"></message>
  </div>
</template>

<script>
import message from '@/components/message'
export default {
  components: {
    message
  },
  data () {
    return {
      show: false,
      list: [],
      defaultProps: {
        children: 'cameras',
        label: 'name'
      }
    }
  },
  mounted () {
    // this.frameRegister()
  },
  destroyed () {
    // this.destroyVideo()
  },
  methods: {
    requireList () {
      // const lists = [{
      //   domain:"GZHOME01.A1",	//域编码
      //   name:"接入服务器1",		// 域名称
      //   cameras:[{
      //     id:"C0001",			//摄像机id
      //     name:"摄像机1",		//摄像机名称
      //     type:0,				//摄像机类型 0 枪机  1 球机  2半球
      //     status:1,			//0 离线  1 在线  2在线 但视频丢失
      //   },{
      //     id:"C0002",			//摄像机id
      //     name:"摄像机2",		//摄像机名称
      //     type:0,				//摄像机类型 0 枪机  1 球机  2半球
      //     status:1,			//0 离线  1 在线  2在线 但视频丢失
      //   }]
      // }]
      window.bykj.frameCall('cameralist')
    },
    getList (list) {
      this.list = list
    },
    showMessage () {
      console.log('click')
      this.show = !this.show
    },
    frameRegister () {
      const cxxNotifier = (cmd, msg) => {
        console.log(msg)
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
          case 'cameralist':
            this.getList()
            break
          default:
            break
        }
      }
      window.bykj.frameRegister(cxxNotifier);
    },
    createVideo () {
      const leftTopRect = document.querySelector('.video-left-top').getBoundingClientRect()
      const leftBottomRect = document.querySelector('.video-left-bottom').getBoundingClientRect()
      const rightTopRect = document.querySelector('.video-right-top').getBoundingClientRect()
      console.log(leftTopRect, leftBottomRect, rightTopRect)
      // const rightBottomRect = document.querySelector('.video-right-bottom').getBoundingClientRect()
      const json = {
        players: [
          { 
            id: 'live-monitor-1',
            x: leftTopRect.left,
            y: leftTopRect.top,
            width: leftTopRect.width,
            height: leftTopRect.height
          },
          { 
            id: 'live-monitor-2',
            x: leftBottomRect.left,
            y: leftBottomRect.top,
            width: leftBottomRect.width,
            height: leftBottomRect.height
          },
          { 
            id: 'live-monitor-3',
            x: rightTopRect.left,
            y: rightTopRect.top,
            width: rightTopRect.width,
            height: rightTopRect.height
          }
        ]
      }
      window.bykj.frameCall('createplayer', JSON.stringify(json))
    },
    startVideo () {
      var json={
        players: [{
          id: 'live-monitor-1', 
          camera:{
            type:0,
            domain:"YFGZHOM1.A1",
            id:	"000002X0000",
            level: 0,
          }
        }]
      }
      window.bykj.frameCall('startplay', JSON.stringify(json))
    },
    stopVideo () {
      var json={
        players:[{
          id: 'lieve-monitor-1'
        },{
          id: 'lieve-monitor-2'
        },{
          id: 'lieve-monitor-3'
        }]
      }
      window.bykj.frameCall('stopplay', JSON.stringify(json))
    },
    destroyVideo () {
      var json={
        players:[{
          id: 'live-monitor-1',
        },{
          id: 'live-monitor-2',
        },{
          id: 'live-monitor-3',
        }]
      }
      window.bykj.frameCall('destroyplayer', JSON.stringify(json));
    }
  }
}
</script>

<style lang="less" scoped>
.circle {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 50px;
  height: 50px;
  z-index: 1000;
  // border: 1px solid #1d4b56;
  // border-radius: 50px;
}
.message {
  position: fixed;
  right: 10px;
  bottom: 70px;
}
.live-monitor {
  height: 100%;
  box-sizing: border-box;
  padding: 24px;
  background: #21232d;
}
.live-monitor-contnet {
  display: flex;
  height: 100%;
  .live-monitor-list {
    width: 352px;
    margin-right: 24px;
    .list-title {
      width: 126px;
      height: 48px;
      background: url('../../assets/tab_bg@2x.jpg');
      background-size: 100% 100%;
      text-align: center;
      line-height: 48px;
      color: #2dccd3;
    }
    .list {
      height: calc(100% - 48px);
      border: 1px solid #13585c;
    }
  }
  .live-monitor-video {
    flex: 1;
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    border: 1px solid #13585c;
    >div {
      box-sizing: border-box;
      width: 50%;
      height: 50%;
      border: 1px solid #13585c;
    }
  }
}
</style>