import config from './config';

let indexFittingUrl = '/fitting/index';
let saveFittingUrl = '/fitting/save';
let deleteFittingUrl = '/fitting';
let inventoryUrl = '/fitting/index/inventory';
let indexClassifyUrl = '/fittingclassify/index';
let saveClassifyUrl = '/fittingclassify/save';

const indexFitting = {
    p: ['get,/fitting/index'],
    r: params => {
        return config.get(indexFittingUrl, params);
    }
};
const saveFitting = {
    p: ['post,/fitting/save'],
    r: params => {
        return config.postJson(saveFittingUrl, params);
    }
};
const deleteFitting = {
    p: ['delete,/fitting'],
    r: params => {
        return config.del(deleteFittingUrl, params);
    }
};
const inventoryFitting = {
    p: ['get,/fitting/index/inventory'],
    r: params => {
        return config.get(inventoryUrl, params);
    }
};
const indexClassify = {
    p: ['get,/fittingclassify/index'],
    r: params => {
        return config.get(indexClassifyUrl, params);
    }
};
const saveClassify = {
    p: ['post,/fittingclassify/save'],
    r: params => {
        return config.postJson(saveClassifyUrl, params);
    }
};
export default {
    indexFitting,
    saveFitting,
    deleteFitting,
    inventoryFitting,
    indexClassify,
    saveClassify
};
