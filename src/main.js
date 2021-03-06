import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import commonJS from './utils/common'
import Treeselect from '@riophae/vue-treeselect'
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.less'
import 'amfe-flexible/index.js'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

Vue.use(ElementUi)
Vue.component('Treeselect', Treeselect)
Vue.config.productionTip = false
Vue.prototype.$commonJS = commonJS

router.beforeEach((to, from, next) => {
  const isLogined = window.bykj && window.bykj.getToken() || true
  if (isLogined) {
    next()
  } else if (to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')
