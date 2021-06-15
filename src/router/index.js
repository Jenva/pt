import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login'
import Layout from '@/layout'
import liveMonitor from '@/view/liveMonitor'

Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/monitor',
        component: liveMonitor
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },

]})


export default router