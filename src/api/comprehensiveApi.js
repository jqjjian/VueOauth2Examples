import config from './config'

const boardUrl = '/comprehensive/index' // 获取所有工单
// const quotationUrl = '/assessment/index' // 获取待估价工单
// const buildUrl = '/construct/index' // 获取待施工工单
// const qcUrl = '/quality' // 质检接口
const saveUrl = '/comprehensive/save' // 保存工单
const updateScheduleUrl = '/comprehensive/updateSchedule' // 更新工单状态
const cancelUrl = '/comprehensive/avalible' // 取消工单
// const buildSingleUrl = '/construct' // 单个项目施工
const accountUrl = '/comprehensive/account'
const seProjectUrl = '/seproject' // 保存更新服务项目接口
const seProjectUpDateUrl = `${seProjectUrl}/updateStatus` // 更新服务项目状态接口
// 所有服务单-查询
const request = {
    p: ['get,/comprehensive/index'],
    r: params => {
        return config.get(boardUrl, params)
    }
}

// 待估计工单-查询
// const quotationList = {
//     p: ['get,/assessment/index'],
//     r: params => {
//         return config.get(quotationUrl, params)
//     }
// }
// 待施工工单-查询
// const buildList = {
//     p: ['get,/construct/index'],
//     r: params => {
//         return config.get(buildUrl, params)
//     }
// }
// 待质检工单-查询
// const qcList = {
//     p: ['get,/quality'],
//     r: params => {
//         return config.get(qcUrl, params)
//     }
// }
// 结算-查询

// 更新工单状态
const updateSchedule = {
    p: ['post,/comprehensive/updateSchedule'],
    r: params => {
        return config.postJson(updateScheduleUrl, params)
    }
}
// 生成综合服务单
const save = {
    p: ['post,/comprehensive/save'],
    r: params => {
        return config.postJson(saveUrl, params)
    }
}
// 修改工单总状态 || 取消工单
const cancel = {
    p: ['post,/comprehensive/avalible'],
    r: params => {
        return config.postJson(cancelUrl, params)
    }
}
// 单个项目施工
// const buildSingle = {
//     p: ['post,/construct'],
//     r: params => {
//         return config.postJson(buildSingleUrl, params)
//     }
// }
// 待收款服务单查询
const account = {
    p: ['get,/comprehensive/account'],
    r: params => {
        return config.get(accountUrl, params)
    }
}
// 保存更新服务项目接口
const seproject = {
    p: [`post,${seProjectUrl}`],
    r: params => config.postJson(seProjectUrl, params)
}
// 更新服务项目状态接口
const seprojectUpdateStatus = {
    p: [`post,${seProjectUpDateUrl}`],
    r: params => config.postJson(seProjectUpDateUrl, params)
}
// 删除服务项目状态接口
const deleteProject = {
    p: [`post,${seProjectUrl}`],
    r: params => config.del(seProjectUrl, params)
}

export default {
    request,
    // quotationList,
    // buildList,
    // qcList,
    updateSchedule,
    save,
    cancel,
    // buildSingle,
    account,
    seproject,
    seprojectUpdateStatus,
    deleteProject
}
