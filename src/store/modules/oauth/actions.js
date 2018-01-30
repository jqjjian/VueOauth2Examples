import { session, catchError } from '@/util';
import { oauthApi } from '@/api';
export default {
    async getUserByToken ({commit}, request) {
        console.log('store:' + request);
        const localToken = session('token');
        const param = {
            access_token: localToken.access_token
        };
        try {
            const res = await oauthApi.getResources.r(param);
            console.log(res);
            commit('LOGIN_USER', res.data);
            return res;
        } catch (err) {
            console.error(err);
            catchError(err);
        }
        // return oauthApi.user.r(param).then(
        //     response => {
        //         console.log(response);
        //         store.commit('loginUser', response.data);
        //         return response.data;
        //     },
        //     error => {
        //         catchError(error);
        //     }
        // );
    },
    initializeUser ({ commit }) {
        commit('INIT_TIALIZE');
    }
};
