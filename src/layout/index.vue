<template>
  <div class="layout">
    <top-nav></top-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import TopNav from './TopNav'
export default {
  components: {
    TopNav
  }
}
</script>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
}
</style>