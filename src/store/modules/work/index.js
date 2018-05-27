import getters from './getters'
import actions from './actions'
import mutations from './mutations'
export default {
    namespaced: true,
    state: {
        PROVINCE: [], // 车牌省份
        workOrder: { // 综合服务单对象
            comprehensiveId: '',
            orderType: 1,
            remark: '',
            seCustomerInfo: null,
            seCarInfo: null
        },
        isEdited: false,
        brandCodeData: { // 车品牌
            selectCarindex: [],
            selectCarObj: {}
        },
        comprehensiveList: [], // 工单列表
        workQueryParams: { // 工单列表查询状态
            workPageNum: 0, // 页码
            size: 0 // 总条数
        }
    },
    getters,
    actions,
    mutations
}
