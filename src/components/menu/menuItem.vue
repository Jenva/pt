<template>
    <li class="menu-item" ref="menu-item">
      <slot></slot>
    </li>
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
      isNormal: true
    }
  },
  mounted () {
    this.listenEvent()
  },
  methods: {
    listenEvent () {
      const menuItem = this.$refs['menu-item']
      menuItem.addEventListener('click', () => {
        this.$parent.selectedChange("menuClick")
        menuItem.classList = 'menu-itemselected'
        this.isClick = true
        this.isNormal = false
      })
    },
    clear () {
      const menuItem = this.$refs['menu-item']
      menuItem.classList = 'menu-item'
    }
  }
}
</script>

<style lang="less" scoped>
.menu-item{
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
}
</style>