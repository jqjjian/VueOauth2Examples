import config from './config'

export default {
    // 获取预约单列表
    getList: {
        p: ['get,/reservation/index'],
        r: params => config.get('/reservation/index', params)
    },
    // 新增修改预约单
    setReservation: {
        p: ['post,/reservation/index'],
        r: params => config.postJson('/reservation/save', params)
    }
}
