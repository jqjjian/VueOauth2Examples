<template>
    <div>
        <template v-for="(v, i) in comprehensiveList">
            <div class="page-part" :key="i">
                <mt-cell :title="v.seCustomerInfo.carNumber + (v.totalFee?'(￥'+v.totalFee+')':'')" is-link :label="v.seCustomerInfo.customerName+' '+v.seCustomerInfo.tel" @click.native="handleEditComprehensive(v)">{{v.createDate}}</mt-cell>
            </div>
        </template>
    </div>
</template>

<script>
import { comprehensiveApi } from '@/api';
import { catchError } from '@/util';
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            comprehensiveList: [],
            title: ''
        };
    },
    methods: {
        ...mapMutations('work', ['SET_CUSTOMER_INFO', 'SET_CAR_INFO', 'CHANGE_EDIT_STATE']),
        handleEditComprehensive(info) {
            this.CHANGE_EDIT_STATE(false);
            this.$router.push({
                name: 'billing-detail-item',
                params: { info }
            });
        },
        handleCreate() {
            this.CHANGE_EDIT_STATE(false);
            this.SET_CUSTOMER_INFO(null);
            this.SET_CAR_INFO(null);
            this.$router.push({ name: 'EditCustomerInfo-item' });
        },
        async handleQuery() {
            try {
                const { data } = await comprehensiveApi.request.r({
                    // accountSquared: '',
                    // operatorId: '',
                    // serviceType: '',
                    // comprehensiveId: '',
                    fromDate: '',
                    endDate: '',
                    orderType: 0,
                    orderStyle: 0,
                    status: 4,
                    param: '',
                    page: 1,
                    pageSize: 9999
                });
                // console.log(data);
                // this.comprehensiveList = data.map(v => {
                //     return {
                //         comprehensiveCd: v.comprehensiveCd,
                //         comprehensiveId: v.comprehensiveId,
                //         carNumber: v.seCustomerInfo ? v.seCustomerInfo.carNumber : '',
                //         brandCode: v.seCarInfo.brandCode,
                //         tel: v.seCustomerInfo ? v.seCustomerInfo.tel : '',
                //         createDate: v.createDate,
                //         carTrainCode: v.seCarInfo.carTrainCode
                //     };
                // });
                this.comprehensiveList = data;
            } catch (err) {
                catchError(err);
            }
        }
    },
    created() {
        this.handleQuery();
        this.title = this.$route.meta.name;
    }
};
</script>

<style lang="postcss">
.container-box {
    padding-top: 44px;
    background: #eee;
}
.page-part {
    padding-bottom: 15px;
}
</style>
