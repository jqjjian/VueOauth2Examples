import config from './config';

const indexFittingUrl = '/fitting/index';
const saveFittingUrl = '/fitting/save';
const deleteFittingUrl = '/fitting/delete';
const inventoryUrl = '/fitting/index/inventory';
const indexClassifyUrl = '/fittingclassify/index';
const saveClassifyUrl = '/fittingclassify/save';
const getpriceUrl = '/fitting/price';
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
    p: ['post,/fitting/delete'],
    r: params => {
        return config.postJson(deleteFittingUrl, params);
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
const getPrice = {
    p: [`get,${getpriceUrl}`],
    r: params => {
        return config.get(getpriceUrl, params);
    }
};
export default {
    indexFitting,
    saveFitting,
    deleteFitting,
    inventoryFitting,
    indexClassify,
    saveClassify,
    getPrice
};
