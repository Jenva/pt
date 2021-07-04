import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login'
import Layout from '@/layout'
import liveMonitor from '@/view/liveMonitor/index'
import vehicleMonitor from '@/view/vehicle/monitor'
import statList from '@/view/vehicle/statList'
import psgFlowMonitor from '@/view/psgFlowMonitor/monitor'
import psgFlowStatList from '@/view/psgFlowMonitor/statList'
import psgFlowHeatMap from '@/view/psgFlowMonitor/heatMap'
import psgFlowTaskManager from '@/view/psgFlowMonitor/taskManager'
import groupManager from '@/view/systemManager'

Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'liveMonitor',
        component: liveMonitor
      },
      {
        path: '/vehicleMonitor',
        component: vehicleMonitor
      },
      {
        path: '/vehicleStatList',
        component: statList
      },
      {
        path: '/psgFlowMonitor',
        component: psgFlowMonitor
      },
      {
        path: '/psgFlowStatList',
        component: psgFlowStatList
      },
      {
        path: '/psgFlowHeatMap',
        component: psgFlowHeatMap
      },
      {
        path: '/psgFlowTaskManager',
        component: psgFlowTaskManager
      },
      {
        path: '/groupManager',
        component: groupManager
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },

]})


export default router