import config from './config';

let accountUrl = '/account'; // 获取待估价工单

const saveAccount = {
    p: ['post,/account'],
    r: params => {
        return config.postJson(accountUrl, params);
    }
};

export default {
    saveAccount
};
