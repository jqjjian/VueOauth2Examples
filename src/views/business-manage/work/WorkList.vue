<template>
    <div>
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'business-manage'})">返回</mt-button>
            <!-- <router-link :to="{name: 'EditCustomerInfo-item'}" slot="right"> -->
            <mt-button @click.native="handleCreate" slot="right">开单</mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="container-box">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore">
                <template v-for="(v, i) in comprehensiveList">
                    <div class="page-part" :key="i">
                        <mt-cell :title="`${v.seCustomerInfo.carNumber}(${v.seCarInfo.brandCode})`" :is-link="v.status !== 5" :label="`开单时间：${v.createDate}`" @click.native="handleEditComprehensive(v.comprehensiveId)">
                            <mt-button type="primary" size="small" v-if="v.status === 5" @click.native.stop="handleSubmitCar(v)">交车</mt-button>
                            <span v-else>{{sviceStateIndex[v.status - 1]}}</span>
                        </mt-cell>
                    </div>
                </template>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
import { comprehensiveApi } from '@/api'
import { catchError } from '@/util'
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            comprehensiveList: [],
            title: '',
            sviceStateIndex: ['待施工', '施工中', '质检中', '待付款', '已付款', '已完结']
        }
    },
    methods: {
        ...mapMutations('work', ['SET_CUSTOMER_INFO', 'SET_CAR_INFO', 'CHANGE_EDIT_STATE']),
        loadTop() {
            console.log('上拉')
        },
        loadBottom() {
            console.log('下拉')
        },
        allLoaded() {
            console.log('拉')
        },
        handleEditComprehensive(id) {
            this.CHANGE_EDIT_STATE(false)
            this.$router.push({
                name: 'work-services-item',
                query: {
                    id
                }
            })
        },
        handleCreate() {
            this.CHANGE_EDIT_STATE(false)
            this.SET_CUSTOMER_INFO(null)
            this.SET_CAR_INFO(null)
            this.$router.push({ name: 'EditCustomerInfo-item' })
        },
        // 交车
        async handleSubmitCar(item) {
            // 保存服务项目报价
            const that = this
            try {
                const result = await that.$message({
                    title: '提示',
                    message: '是否已将车辆交给车主？',
                    showCancelButton: true
                })
                if (result === 'confirm') {
                    await comprehensiveApi.updateSchedule.r({
                        billId: item.comprehensiveId,
                        status: 6
                    })
                    that.$toast({
                        message: '已交车',
                        iconClass: 'icon icon-success',
                        duration: 2000
                    })
                    item.status = 6
                }
            } catch (err) {
                console.error(err)
                catchError(err)
            }
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
                    status: '',
                    param: '',
                    page: 1,
                    pageSize: 9999
                })
                console.log(data)
                this.comprehensiveList = data
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
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        }
    },
    created() {
        this.handleQuery()
        this.title = this.$route.meta.name
    }
}
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
