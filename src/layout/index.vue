<template>
  <div class="layout">
    <top-nav v-if="!showMenu"></top-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import TopNav from './TopNav'
export default {
  components: {
    TopNav
  },
  watch: {
    $route () {
      this.changeMode()
    }
  },
  computed: {
    showMenu () {
      return window.bykj
    }
  },
  mounted () {

  },
  methods: {
    changeMode () {
      const type = /dark/.test(this.$route.query.type)
      const dom = document.body
      dom.id = 'light'
      if (type) {
        dom.id = 'dark'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
}
</style>