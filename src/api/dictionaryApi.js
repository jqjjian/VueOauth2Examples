import config from './config';

let boardUrl = '/dictionary';

// 获取字典信息
const request = {
    p: ['get,/dictionary'],
    r: params => config.get(boardUrl, params)
};

export default {
    request
};
