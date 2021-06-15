<template>
  <div>
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
      show: false
    }
  },
  methods: {
    showMessage () {
      console.log('click')
      this.show = !this.show
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
</style>