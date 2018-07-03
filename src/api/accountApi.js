import config from './config'
const baseUrl = window.gloable.payUrl
let accountUrl = '/account' // 获取待估价工单
const aliPayUrl = '/pay/alipay/qrcode'
const aliWapUrl = '/pay/alipay/wap'
const saveAccount = {
    p: ['post,/account'],
    r: params => {
        return config.postJson(baseUrl + accountUrl, params)
    }
}

// 生成支付宝二维码
const getAliPayQrcode = {
    p: [`get,${aliPayUrl}`],
    r: params => config.get(baseUrl + aliPayUrl, params)
}

// wap 支付宝接口
const toAliPay = {
    p: [`post,${aliWapUrl}`],
    r: params => config.postJson(baseUrl + aliWapUrl, params)
}
export default {
    saveAccount,
    getAliPayQrcode,
    toAliPay
}
