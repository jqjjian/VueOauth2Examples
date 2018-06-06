import config from './config'

const baseUrl = '/seproject'

// 删除服务项目
const deleteSeProject = {
    p: [`delete,${baseUrl}`],
    r: params => config.del(baseUrl, params)
}

// 保存修改服务项目
const saveSeProject = {
    p: [`post,${baseUrl}`],
    r: params => config.get(baseUrl, params)
}

// 无法施工
const unableSeProject = {
    p: [`post,${baseUrl}/unable`],
    r: params => config.postJson(baseUrl + '/unable', params)
}

// 确认无法施工
const unableConfirmSeProject = {
    p: [`post,${baseUrl}/unableConfirm`],
    r: params => config.postJson(baseUrl + '/unableConfirm', params)
}

// 更新服务项目状态
const updateStatusSeProject = {
    p: [`post,${baseUrl}/updateStatus`],
    r: params => config.postJson(baseUrl + '/updateStatus', params)
}

export default {
    deleteSeProject,
    saveSeProject,
    unableSeProject,
    unableConfirmSeProject,
    updateStatusSeProject
}
