import config from './config';

let boardUrl = '/comprehensive/index'; // 获取所有工单
let quotationUrl = '/assessment/index'; // 获取待估价工单
let buildUrl = '/construct/index'; // 获取待施工工单
let qcUrl = '/quality'; // 质检接口
let saveUrl = '/comprehensive/save'; // 保存工单
let updateScheduleUrl = '/comprehensive/updateSchedule'; // 更新工单状态
let cancelUrl = '/comprehensive/avalible'; // 取消工单
let buildSingleUrl = '/construct'; // 单个项目施工
let accountUrl = '/comprehensive/account';

// 所有服务单-查询
const request = {
    p: ['get,/comprehensive/index'],
    r: params => {
        return config.get(boardUrl, params);
    }
};

// 待估计工单-查询
const quotationList = {
    p: ['get,/assessment/index'],
    r: params => {
        return config.get(quotationUrl, params);
    }
};
// 待施工工单-查询
const buildList = {
    p: ['get,/construct/index'],
    r: params => {
        return config.get(buildUrl, params);
    }
};
// 待完工工单-查询
// 待质检工单-查询
const qcList = {
    p: ['get,/quality'],
    r: params => {
        return config.get(qcUrl, params);
    }
};
// 结算-查询

// 更新工单状态
const updateSchedule = {
    p: ['post,/comprehensive/updateSchedule'],
    r: params => {
        return config.postJson(updateScheduleUrl, params);
    }
};
const save = {
    p: ['post,/comprehensive/save'],
    r: params => {
        return config.postJson(saveUrl, params);
    }
};
// 取消工单
const cancel = {
    p: ['post,/comprehensive/avalible'],
    r: params => {
        return config.postJson(cancelUrl, params);
    }
};
// 单个项目施工
const buildSingle = {
    p: ['post,/construct'],
    r: params => {
        return config.postJson(buildSingleUrl, params);
    }
};
// 待收款服务单查询
const account = {
    p: ['get,/comprehensive/account'],
    r: params => {
        return config.get(accountUrl, params);
    }
};

export default {
    request,
    quotationList,
    buildList,
    qcList,
    updateSchedule,
    save,
    cancel,
    buildSingle,
    account
};