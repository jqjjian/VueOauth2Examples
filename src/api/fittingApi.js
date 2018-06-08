import config from './config'

const indexFittingUrl = '/fitting/index'
const saveFittingUrl = '/fitting/save'
const deleteFittingUrl = '/fitting'
const inventoryUrl = '/fitting/index/inventory'
const indexClassifyUrl = '/fittingclassify/index'
const saveClassifyUrl = '/fittingclassify/save'
const getpriceUrl = '/fitting/price'

const indexFitting = {
    p: ['get,/fitting/index'],
    r: params => config.get(indexFittingUrl, params)
}
const saveFitting = {
    p: ['post,/fitting/save'],
    r: params => config.postJson(saveFittingUrl, params)
}
const deleteFitting = {
    p: ['delete,/fitting'],
    r: params => config.del(deleteFittingUrl, params)
}

// 获取物料列表
const inventoryFitting = {
    p: ['get,/fitting/index/inventory'],
    r: params => config.get(inventoryUrl, params)
}

const indexClassify = {
    p: ['get,/fittingclassify/index'],
    r: params => config.get(indexClassifyUrl, params)
}

const saveClassify = {
    p: ['post,/fittingclassify/save'],
    r: params => config.postJson(saveClassifyUrl, params)
}

// 获取物料价格
const getPrice = {
    p: [`get,${getpriceUrl}`],
    r: params => config.get(getpriceUrl, params)
}
export default {
    indexFitting,
    saveFitting,
    deleteFitting,
    inventoryFitting,
    indexClassify,
    saveClassify,
    getPrice
}
