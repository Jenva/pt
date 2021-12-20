<template>
  <div class="top-title">
    <img src="../assets/live_icon_title_normal.png" alt="" class="icon">
    <span class="text">{{title}}</span>
    <img src="../assets/live_icon_close_normal.png" alt="" class="close" @click="close">
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '消息'
    }
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
#dark {
  .top-title {
    .text {
      color: #fff;
    }
  }
}
#light {
  .top-title {
    .text {
      color: #2491F6;
    }
  }
}
.top-title {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 11px 15px 11px 12px;
  .icon,
  .close {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .text {
    flex: 6;
    margin-left: 12px;
    font-size: 20Px;
    color: #fff;
  }
}
</style>