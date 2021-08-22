<template>
  <ul>
    <slot></slot>
    <!-- <menu-item :menu="menu" v-for="menu in menuList" :key="menu.route" @selectedChange="selectedChange" :ref="menu.route">
    </menu-item> -->
  </ul>
</template>

<script>
// import MenuItem from './menuItem'
export default {
  // components: { MenuItem },
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isHover: false,
      isClick: false,
      isNormal: true
    }
  },
  mounted () {
    // this.listenEvent()
  },
  methods: {
    selectedChange () {
      console.log('change')
      this.$slots.default.forEach(item => {
        item.componentInstance.clear()
      })
    },
    listenEvent () {
      const navCell = document.querySelector('.nav-list')
      navCell.addEventListener('mouseenter', () => {
        this.isHover = true
        this.isNormal = false
      })
      navCell.addEventListener('mouseleave', () => {
        this.isHover = false
        this.isNormal = true
      })
      navCell.addEventListener('click', () => {
        navCell.classList = 'nav-list selected'
        this.isClick = true
        this.isNormal = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  display: flex;
  height: 100%;
  align-items: center;
}
.nav-list {
  position: relative;
  box-sizing: border-box;
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
  // .live-border-left {
  //   position: absolute;
  //   top: -1px;
  //   left: 0;
  //   width: 50px;
  //   height: 48px;
  //   transform: translate(-50%);
  //   background: url('../assets/nav_tool/nav_icon_selectedborder_left.png');
  // }
  // .live-border-right {
  //   position: absolute;
  //   top: -1px;
  //   right: 0;
  //   width: 26px;
  //   height: 48px;
  //   background: url('../assets/nav_tool/nav_icon_selectedborder_right.png');
  //   z-index: 10;
  // }
}
</style>