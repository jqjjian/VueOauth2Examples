import config from './config';

let boardUrl = '/workproject/index';
let saveUrl = '/workproject/save';
let typeUrl = '/workproject/type';

const request = {
    p: ['get,/workproject/index'],
    r: params => config.get(boardUrl, params)
};

const requestType = {
    p: ['get,/workproject/type'],
    r: params => config.get(typeUrl, params)
};

const save = {
    p: ['post,/workproject/save'],
    r: params => config.postJson(saveUrl, params)
};

const saveType = {
    p: ['post,/workproject/type'],
    r: params => config.postJson(typeUrl, params)
};

export default {
    request,
    requestType,
    save,
    saveType
};
