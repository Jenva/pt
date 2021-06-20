<template>
<div ref="content">
  <li class="nav-list" ref="nav-list">
    <div class="live-border-left"></div>
    <span class="live-icon">
      <img :src="menu.clickIcon" alt="" v-if="isClick">
      <img :src="menu.hoverIcon" alt="" v-else-if="isHover">
      <img :src="menu.normalIcon" alt="" v-else-if="isNormal">
    </span>
    <span :class="['text', isHover ? 'heightLight' : '']" @click="changeRoute(menu.route)">{{ menu.title }}</span>
    <div class="live-border-right"></div>
    <div class="mark"></div>
    <div class="nav-select-chlid" ref="nav-select-chlid" v-show="isHover">
      <ul class="child-list" ref="child-list">
        <!-- <div class="top"></div> -->
        <!-- <li>测试sssssssssssssssssssssssssssssssssss</li> -->
        <li v-for="(item, index) in menu.children" :key="index" @click="changeRoute(item.route)">{{ item.title }}</li>
        <!-- <div class="bottom"></div> -->
      </ul>
    </div>
  </li>
</div>
</template>

<script>
export default {
  props: {
    menu: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isHover: false,
      isClick: false,
      isNormal: true,
      timeId: 0
    }
  },

  mounted () {
    console.log(this.$refs['nav-select-chlid'])
    this.listenEvent()
  },
  methods: {
    listenEvent () {
      const navCell = this.$refs['nav-list']
      const content = this.$refs['content']
      const navChild = this.$refs['nav-select-chlid']
      const lis = navChild.querySelectorAll('li')
      content.addEventListener('mouseenter', () => {
        clearTimeout(this.timeId)
        this.isHover = true
        this.isNormal = false
      })
      navChild.addEventListener('mouseenter', () => {
        clearTimeout(this.timeId)
        this.isHover = true
        this.isNormal = false
      })
      content.addEventListener('mouseleave', () => {
        this.timeId = setTimeout(() => {
          this.isHover = false
          this.isNormal = true
        }, 200)
      })
      navChild.addEventListener('mouseleave', () => {
        this.timeId = setTimeout(() => {
          this.isHover = false
          this.isNormal = true
        }, 200)
      })
      content.addEventListener('click', () => {
        // this.$emit('selectedChange')
        this.$parent.selectedChange("menuClick")
        navCell.classList = 'nav-list selected'
        this.isClick = true
        this.isNormal = false
      })
      navChild.addEventListener('click', (e) => {
        setTimeout(() => {
          lis.forEach(item => {
            item.classList = ''
          })
          e.target.classList = 'clicked'
        })
      })
    },
    changeRoute (route) {
      if (route) {
        this.$router.push(route)
      }
    },
    clear () {
      const navCell = this.$refs['nav-list']
      const navChild = this.$refs['nav-select-chlid']
      const lis = navChild.querySelectorAll('li')
      this.isHover = false
      this.isClick = false
      this.isNormal = true
      navCell.classList = 'nav-list'
      lis.forEach(item => {
        item.classList = ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  // position: relative;
  height: 70px;
}
.nav-list {
  position: relative;
  // box-sizing: border-box;
  height: 48px;
  padding: 0 10px 0 30px;
  margin-left: 43px;
  flex-shrink: 0;
  max-width: 200px;
  &:hover {
    cursor: pointer;
  }
  .live-icon {
    position: absolute;
    width: 42px;
    height: 42px;
    transform: translate(-50%);
    // vertical-align: middle;
    left: 0;
    top: 2px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .text {
    font-size: 24px;
    color: #ccc;
    line-height: 42px;
  }
  .heightLight {
    color: #2dccd3;
  }
  .nav-select-chlid {
    position: absolute;
    box-sizing: border-box;
    width: calc(100% + 38px);
    // border-left: 2px solid;
    // border-right: 2px solid;
    // border-bottom: 12px solid;
    // border-top: 18px solid;
    top: 50px;
    left: -32px;
    // left: -50%;
    // transform: translateX(50%);
    // border-image-source: url('../../assets/nav_tool/nav-content.png');
    // border-image-slice: 18 2 12 2;
    z-index: 1000;
    .child-list{
      position: relative;
      border: 1px solid #2dccd3;
      // border-right: 1px solid #2dccd3;
      background:#0f404c;
      // .top {
      //   width: calc(100% + 2px);
      //   position: absolute;
      //   height: 20px;
      //   top: -20px;
      //   left: 0;
      //   background: url('../../assets/nav_tool/nav-content-top.png') no-repeat;
      //   background-size: 100% 100%;
      // }
      li {
        box-sizing: border-box;
        padding: 20px;
        &:hover {
          background:#165864;
        }
      }
      // .bottom {
      //   position: absolute;
      //   width: calc(100% + 2px);
      //   height: 20px;
      //   bottom: -12px;
      //   left: 0;
      //   background: url('../../assets/nav_tool/nav-content-bottom.png') no-repeat;
      //   background-size: 100% 100%;
      // }
    }
  }

  .mark {
    position: absolute;
    bottom: -1px;
    right: 0;
    width: 24px;
    height: 10px;
    background: #13151f;
    z-index: 9;
  }
}
.selected {
  border-bottom: 1px solid #2dccd3;
  border-top: 1px solid #2dccd3;
  .text {
    color: #2dccd3;
  }
  .live-border-left {
    position: absolute;
    top: -1px;
    left: 0;
    width: 50px;
    height: 48px;
    transform: translate(-50%);
    background: url('../../assets/nav_tool/nav_icon_selectedborder_left.png');
  }
  .live-border-right {
    position: absolute;
    top: -1px;
    right: 0;
    width: 26px;
    height: 48px;
    background: url('../../assets/nav_tool/nav_icon_selectedborder_right.png');
    z-index: 10;
  }
}
.clicked {
  background: url('../../assets/nav_tool/nav_selected_bg@2x.jpg');
  background-size: 100% 100%;
}
</style>