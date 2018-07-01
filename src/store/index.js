import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
    namespaced: true,
    state: {
        Permission: {}
    },
    actions,
    mutations,
    getters,
    modules
})
