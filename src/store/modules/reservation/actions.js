// import { catchError } from '@/util';
import { carApi, comprehensiveApi, dictionaryApi } from '@/api'
import * as R from 'ramda'
export default {
    async getComprehensive({ commit }, id) {
        const { data } = await comprehensiveApi.request.r({
            accountSquared: '',
            operatorId: '',
            serviceType: '',
            comprehensiveId: id,
            fromDate: '',
            endDate: '',
            orderType: 0,
            orderStyle: 0,
            param: '',
            page: 1,
            pageSize: 9999
        })
        console.log(data[0])
    },
    async getBrandCode({ commit }) {
        const res = await carApi.requestBrand.r()
        console.log(res)
        const selectCarindex = R.sort((a, b) => (a > b ? 1 : a === b ? 0 : -1), [
            ...new Set(R.map(R.prop('firstLetter'))(res.data))
        ])
        console.log(selectCarindex)
        const selectCarObj = {}
        for (let v of res.data) {
            if (selectCarObj[v.firstLetter]) {
                selectCarObj[v.firstLetter].children.push(v)
            } else {
                selectCarObj[v.firstLetter] = {
                    children: [v]
                }
            }
        }
        console.log(selectCarObj)
        commit('SET_SELECT_CAR_INDEX', { selectCarindex, selectCarObj })
    },
    async getProvince({ commit }) {
        const { data } = await dictionaryApi.request.r({
            code: 'PROVINCE'
        })
        console.log('车牌地区', data.PROVINCE)
        commit('SET_PROVINCE', data.PROVINCE)
    }
}
