import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.css'

Vue.use(ElementUi)
Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   const isLogined = window.bykj.getToken()
//   console.log(isLogined)
//   if (isLogined) {
//     next()
//   } else if (to.path === '/login') {
//     next()
//   } else {
//     next('/login')
//   }
// })

new Vue({
  render: h => h(App),
  router: router,
  store
}).$mount('#app')
