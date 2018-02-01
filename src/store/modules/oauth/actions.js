import { session, catchError } from '@/util';
import { oauthApi } from '@/api';
export default {
    async getUserByToken ({commit}, request) {
        const localToken = session('token');
        const param = {
            access_token: localToken.access_token
        };
        try {
            const res = await oauthApi.getResources.r(param);
            console.log('res>>>>>:', res);
            commit('LOGIN_USER', res.data);
            return res;
        } catch (err) {
            console.error(err);
            catchError(err);
        }
    },
    initializeUser ({ commit }) {
        commit('INIT_TIALIZE');
    }
};
