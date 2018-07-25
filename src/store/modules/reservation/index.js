import getters from './getters'
import actions from './actions'
import mutations from './mutations'
export default {
    namespaced: true,
    state: {
        listData: [], // 预约单列表
        queryParams: { // 预约单列表查询状态
            PageNum: 1, // 页码
            total: 0 // 总条数
        },
        currentItem: null
    },
    getters,
    actions,
    mutations
}
