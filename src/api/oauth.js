import config from './config';
const baseurl = window.gloable.authUrl;

export default {
    getResources: {
        p: ['get,/auth/user/resource'],
        r: params => config.get(baseurl + 'api/v1/sys/user/resources/token', params)
    },
    getToken: {
        p: ['get,/oauth/token'],
        r: params => config.post(baseurl + 'oauth/token', params)
    }
};
