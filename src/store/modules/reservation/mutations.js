export default {
    SET_LIST(state, payload) {
        // 预约单列表
        console.log('workOrder', payload)
        state.listData = payload
    },
    SET_PAGENUM(state, num) {
        // 预约单列表页码
        state.queryParams.PageNum = num
    },
    SET_LIST_TOTAL(state, total) {
        // 预约单列表总数
        state.queryParams.total = total
    },
    // 设置当前条目
    SET_CURRENT_ITEM(state, item) {
        state.currentItem = item
    }
}
