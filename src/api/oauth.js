import config from './config'
// const baseurl = window.gloable.baseUrl
const tokenUrl = window.gloable.authUrl
export default {
    getResources: {
        p: ['get,/auth/user/resource'],
        r: params => config.get(tokenUrl + '/api/v1/sys/user/resources/token', params)
    },
    getToken: {
        p: [`get,${tokenUrl}/oauth/token`],
        r: params => config.post(tokenUrl + '/oauth/token', params)
    },
    clearToken: {
        p: ['get,/oauth/revoke_token'],
        r: params => config.get(tokenUrl + '/oauth/revoke_token', params)
    }
}
