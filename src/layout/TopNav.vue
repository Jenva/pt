<template>
  <div class="top-nav">
    <div class="logo">
      <div class="logo-img">
        <img src="../assets/nav_tool/nav_img_logo_normal.png" alt="">
      </div>
      <h1 class="title">视频监控分析平台</h1>
    </div>
    <div class="nav">
      <div class="leftArrow" @click="moveMenu('l')"></div>
      <cust-nav class="cust-nav">
        <sub-menu :menu="menu" v-for="menu in menuList" :key="menu.route">
        </sub-menu>
      </cust-nav>
      <div class="rightArrow"  @click="moveMenu('r')"></div>
    </div>
    <div class="user-info">
      <el-row class="user">
        <el-col span="5" class="imgCol">
          <img src="../assets/nav_tool/nav_icon_usermanagement_normal.png" alt="">
        </el-col>
        <el-col span="12">
          <div class="userName">管理员</div>
        </el-col>
      </el-row>
      <div class="setting">
        <img src="../assets/nav_tool/nav_icon_setup_normal.png" alt="">
      </div>
      <div class="tool">
        <div span="8" class="minimize">
          <img src="../assets/nav_tool/nav_icon_minimize_normal.png" alt="">
        </div>
        <div span="8" class="maximize">
          <img src="../assets/nav_tool/nav_icon_maximize_normal.png" alt="">
        </div>
        <div span="8">
          <img src="../assets/nav_tool/nav_icon_closewindow_normal.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import custNav from '@/components/menu/'
import SubMenu from '@/components/menu/subMenu.vue'
export default {
  components: { custNav, SubMenu },
  data () {
    return {
      index: 0,
      menuList: [
        {
          title: '实况监控',
          route: '/liveMonitor',
          clickIcon: require('../assets/nav_tool/nav_icon_live_click.png'),
          hoverIcon: require('../assets/nav_tool/nav_icon_live_hover.png'),
          normalIcon: require('../assets/nav_tool/nav_icon_live_normal.png')
        },
        {
          title: '五类车监控',
          route: '/monitor1',
          clickIcon: require('../assets/nav_tool/nav_icon_passengerflowmanagement_click.png'),
          hoverIcon: require('../assets/nav_tool/nav_icon_passengerflowmanagement_hover.png'),
          normalIcon: require('../assets/nav_tool/nav_icon_passengerflowmanagement_normal.png'),
          children: [
            {
              title: '五类车监控',
              route: '/vehicleMonitor'
            },
            {
              title: '五类车统计列表',
              route: '/vehicleStatList'
            },
            {
              title: '五类车统计报表'
            }
          ]
        },
        {
          title: '客流管理',
          route: '/monitor2',
          clickIcon: require('../assets/nav_tool/nav_icon_live_click.png'),
          hoverIcon: require('../assets/nav_tool/nav_icon_live_hover.png'),
          normalIcon: require('../assets/nav_tool/nav_icon_live_normal.png'),
          children: [
            {
              title: '客流监控',
              route: '/psgFlowMonitor'
            },
            {
              title: '客流统计列表',
              route: '/psgFlowStatList'
            },
            {
              title: '客流实时热力地图',
              route: '/psgFlowHeatMap'
            },
            {
              title: '客流任务启动设置',
              route: '/psgFlowTaskManager'
            },
          ]
        },
        {
          title: '系统管理',
          route: '/monitor3',
          clickIcon: require('../assets/nav_tool/nav_icon_live_click.png'),
          hoverIcon: require('../assets/nav_tool/nav_icon_live_hover.png'),
          normalIcon: require('../assets/nav_tool/nav_icon_live_normal.png'),
          children: [
            {
              title: '分组管理',
              route: '/groupManager'
            }
          ]
        }
      ]
    }
  },
  methods: {
    moveMenu (type) {
      console.log(type)
      const nav = document.querySelector('.cust-nav')
      if (type === 'l') {
        this.index--
        if (Math.abs(this.index) >= this.menuList.length) {
          this.index++
          return
        }
        nav.style.left = 180 * this.index + 'px'
      } else {
        this.index++
        if (Math.abs(this.index) >= this.menuList.length) {
          this.index--
          return
        }
        nav.style.left = 180 * this.index + 'px'
      }
    },
    handleSelect () {
      
    }
  }
}
</script>

<style lang="less" scoped>
.top-nav {
  display: flex;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  padding: 0 36px 0 41px;
  background: #13151f;
  .nav {
    flex: 2;
    float: left;
    position: relative;
    height: 100%;
    width: 1177px;
    margin-left: 30px;
    // overflow: hidden;
    .leftArrow {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: 20px;
      height: 25px;
      z-index: 10;
      background: url('../assets/nav_tool/nav_icon_left_normal.png') no-repeat;
      background-size: 100% 100%;
    }
    .rightArrow {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      width: 20px;
      height: 25px;
      background: url('../assets/nav_tool/nav_icon_right_normal.png') no-repeat;
      background-size: 100% 100%;
    }
    .cust-nav {
      position: relative;
      transition: 1s left;
      left: 0
    }
  }
  .logo {
    flex: 1;
    float: left;
    .logo-img {
      display: inline-block;
      width: 113px;
      height: 42px;
      margin: 10px 12px 0 0;
      vertical-align: sub;
    }
    h1 {
      display: inline-block;
      font-size: 28px;
      color: #fff;
      line-height: 64px;
    }
  }
  .user-info {
    flex: 1;
    float: right;
    display: flex;
    width: 264px;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    .user {
      width: 104px;
      height: 27px;
      line-height: 27px;
      .imgCol {
        width: 24px;
        height: 24px;
        margin: 0 4px 0 10px;
        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
        }
      }
      .userName {
        color: #6a747f;
      }
    }
    .setting {
      height: 27px;
      width: 47px;
    }
    .tool {
      display: flex;
      height: 27px;
      .minimize {
        margin-right: 16px;
      }
      .maximize {
        margin-right: 15px;
      }
    }
  }
}
</style>