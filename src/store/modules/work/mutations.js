import * as R from 'ramda'
export default {
    SET_CUSTOMER_INFO(state, payload) {
        // 缓存送修人信息
        console.log(payload)
        state.workOrder.seCustomerInfo = R.clone(payload)
    },
    SET_CAR_INFO(state, payload) {
        // 缓存车辆信息
        console.log(payload)
        state.workOrder.seCustomerInfo = R.clone(payload)
    },
    SET_WORK_ORDER(state, payload) {
        // 工单信息
        console.log('workOrder', payload)
        state.workOrder = payload
    },
    SET_SELECT_CAR_INDEX(state, payload) {
        // 缓存车品牌
        state.brandCodeData = R.clone(payload)
    },
    CHANGE_EDIT_STATE(state, _state) {
        // 是否已经编辑过
        state.isEdited = _state
    },
    SET_PROVINCE(state, provinces) {
        // 设置车牌地区
        state.PROVINCE = provinces
    },
    SET_WORK_LIST(state, payload) {
        // 工单列表
        console.log('workOrder', payload)
        state.comprehensiveList = payload
    },
    SET_WORK_PAGENUM(state, num) {
        // 工单列表页码
        state.workQueryParams.workPageNum = num
    },
    SET_WORK_LIST_SIZE(state, size) {
        // 工单列表总数
        state.workQueryParams.size = size
    },
    SET_PROJECT_LIST(state, list) {
        // 设置服务项目列表
        state.workOrder.seProjectList = list
    }
}
