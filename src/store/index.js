import Vuex from 'vuex'
import Vue from 'vue'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  logined: false
}

export default new Vuex.Store ({
  state,
  mutations
})