import config from './config';

const baseUrl = '/construct';
const getConstructUrl = baseUrl + '/index';

// 获取字典信息
const request = {
    p: [`get,${getConstructUrl}`],
    r: params => config.get(getConstructUrl, params)
};
const setConstruct = {
    p: [`post,${baseUrl}`],
    r: params => config.postJson(baseUrl, params)
};
export default {
    request,
    setConstruct
};
