<template>
  <div class="sideBar">
    <window-top-title></window-top-title>
    <div class="content">
      <slot></slot>
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

    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 24px;
}
</style>