// import NProgress from 'nprogress';
import axios from 'axios'
import qs from 'qs'
import { catchError } from '@/util'
import { Indicator } from 'mint-ui'
// import authConfig from '../config/authConfig';
const gd = window.gloable
const instance = axios.create({
    baseURL: gd.baseUrl,
    timeout: 10000
})
const checkStatus = response => {
    console.log('check')
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response.data
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
}
// const post = async (url, data) => {
//     // const _data = data.aa ? qs.stringify(data, { arrayFormat: 'repeat' }) : qs.stringify(data);
//     try {
//         const res = await instance({
//             method: 'post',
//             // baseURL: "http://localhost:8089/",
//             url,
//             data: qs.stringify(data), // 请求时带的参数
//             headers: {
//                 'X-Requested-With': 'XMLHttpRequest',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//             },
//             timeout: 10000
//         });
//         return checkStatus(res);
//     } catch (err) {
//         console.error(err);
//     }
// return instance({
//     method: 'post',
//     // baseURL: "http://localhost:8089/",
//     url,
//     data: qs.stringify(data), // 请求时带的参数
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     timeout: 10000
// }).then(response => {
//     return checkStatus(response);
// });
// };
// 设置请求等待
instance.interceptors.request.use(
    config => {
        // loading
        // NProgress.set(0.4);
        Indicator.open()
        return config
    },
    error => {
        catchError(error)
    }
)
// 设置请求响应后处理
instance.interceptors.response.use(
    response => {
        // NProgress.done();
        Indicator.close()
        return checkStatus(response)
    },
    error => {
        Indicator.close()
        // console.log('error', error.config);
        // console.log('error-url', error.config.url);
        // const originalRequest = error.config;
        // var loginUrl = gd.authUrl + 'oauth/token';
        // // 先判断是否放行的url
        // if (!authConfig.allowUrls[originalRequest.url]) {
        //     console.log('不是放行url');
        //     let localToken = util.session('token');
        //     var params = {
        //         client_id: authConfig.client.client_id,
        //         client_secret: authConfig.client.client_secret,
        //         grant_type: 'refresh_token',
        //         refresh_token: localToken.refresh_token
        //     };
        //     console.log('error', error);
        //     console.log('error.response', error.response);
        //     if (error.response) {
        //         if (error.response.status === 401 && !originalRequest._retry) {
        //             return post(loginUrl, params).then(data => {
        //                 if (data && data.hasOwnProperty('access_token')) {
        //                     // 保存access_token 到本地
        //                     util.session('token', data);
        //                     instance.defaults.headers.common.Authorization = 'Bearer ' + data.access_token;
        //                     // retry request
        //                     originalRequest.headers.Authorization = 'Bearer ' + data.access_token;
        //                     return instance(originalRequest);
        //                 }
        //             });
        //         }
        //     }
        // }
        // NProgress.done();
        catchError(error)
    }
)

export default {
    async post(url, data) {
        try {
            return await instance({
                method: 'post',
                // baseURL: "http://localhost:8089/",
                url,
                data: qs.stringify(data), // 请求时带的参数
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                timeout: 10000
            })
        } catch (err) {
            console.error(err)
        }
    },
    async postJson(url, data) {
        try {
            return await instance({
                method: 'post',
                url,
                data, // 请求时带的参数
                timeout: 10000
            })
        } catch (err) {
            console.error(err)
        }
    },
    async get(url, params) {
        try {
            return await instance({
                method: 'get',
                url,
                params, // 请求时带的参数
                timeout: 10000,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
        } catch (err) {
            console.error(err)
        }
        // return instance({
        //     method: 'get',
        //     url,
        //     params, // 请求时带的参数
        //     timeout: 10000,
        //     headers: {
        //         'X-Requested-With': 'XMLHttpRequest'
        //     }
        // }).then(response => {
        //     return checkStatus(response);
        // });
        // .then(
        //   (res) => {
        //     return checkCode(res)
        //   }
        // )
    },
    async del(url, params) {
        try {
            return instance({
                method: 'delete',
                // baseURL: "http://localhost:8089/",
                url,
                params, // 请求时带的参数
                timeout: 10000
                // headers: {
                //     'X-Requested-With': 'XMLHttpRequest'
                // }
            })
        } catch (err) {
            console.error(err)
        }
        // return instance({
        //     method: 'delete',
        //     // baseURL: "http://localhost:8089/",
        //     url,
        //     params, // 请求时带的参数
        //     timeout: 10000
        //     // headers: {
        //     //     'X-Requested-With': 'XMLHttpRequest'
        //     // }
        // }).then(response => {
        //     return checkStatus(response);
        // });
    },
    instance
}
