import getters from './getters'
import actions from './actions'
import mutations from './mutations'
export default {
    namespaced: true,
    state: {
        PROVINCE: [],
        workOrder: {
            comprehensiveId: '',
            orderType: 1,
            remark: '',
            seCustomerInfo: null,
            seCarInfo: null
        },
        isEdited: false,
        brandCodeData: {
            selectCarindex: [],
            selectCarObj: {}
        }
    },
    getters,
    actions,
    mutations
}
