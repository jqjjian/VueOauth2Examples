<template>
    <div class="container-box">
        <template v-for="(v, i) in comprehensiveList">
            <div class="page-part" :key="i">
                <mt-cell :title="`${v.carNumber}(${v.brandCode})`"
                is-link
                :label="`开单时间：${v.startTime}`"
                @click.native="handleEditComprehensive(v.comprehensiveId)"
                ></mt-cell>
            </div>
        </template>
    </div>
</template>

<script>
import { constructApi } from '@/api';
import { catchError } from '@/util';
export default {
    data () {
        return {
            comprehensiveList: []
        };
    },
    methods: {
        handleEditComprehensive (id) {
            this.$router.push({
                name: 'constructionOperation-item',
                query: {
                    id
                }
            });
        },
        async handleQuery () {
            try {
                const { data } = await constructApi.request.r({
                    accountSquared: '',
                    operatorId: '',
                    serviceType: '',
                    comprehensiveId: '',
                    fromDate: '',
                    endDate: '',
                    orderType: 0,
                    orderStyle: 0,
                    status: 3,
                    param: '',
                    page: 1,
                    pageSize: 9999
                });
                this.comprehensiveList = data.map(v => {
                    return {
                        comprehensiveCd: v.comprehensiveCd,
                        comprehensiveId: v.comprehensiveId,
                        carNumber: v.seCustomerInfo.carNumber,
                        brandCode: v.seCarInfo.brandCode,
                        tel: v.seCustomerInfo.tel,
                        startTime: v.seCustomerInfo.startTime,
                        carTrainCode: v.seCarInfo.carTrainCode
                    };
                });
                console.log(this.comprehensiveList);
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        }
    },
    created () {
        this.handleQuery();
    }
};
</script>

<style lang="postcss">
.container-box {
    background: #eee;
}
.page-part{
    padding-bottom: 15px;
}
</style>
