<template>
    <div>
        <mt-header fixed :title="$route.meta.name">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'business-manage'})">返回</mt-button>
            <!-- <router-link :to="{name: 'EditCustomerInfo-item'}" slot="right"> -->
            <mt-button @click.native="handleCreate" slot="right">新增</mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="container-box" v-infinite-scroll="loadMore" :infinite-scroll-distance="10">
            <mt-loadmore style="" :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore">
                <template v-for="(v, i) in listData">
                        <mt-cell  is-link @click.native="handleCheck(v, i)" :key="i" class="r-cell">
                            <!-- <mt-button type="primary" size="small" v-if="v.status === 5" @click.native.stop="handleSubmitCar(v)">交车</mt-button>
                            <span v-else>{{sviceStateIndex[v.status - 1]}}</span> -->
                            <slot name="value">
                                <div class="my-item">
                                    <div class="info">
                                        <div class="carUser">
                                            <span>{{v.carUserName}}</span>
                                            <span>{{v.phone}}</span>
                                            <span>{{v.carInfo}}</span>
                                        </div>
                                        <div class="date">
                                            <span>{{`预约时间：${v.reservationTime}`}}</span>
                                            <span>{{`服务方式：${serviceStyle[v.serviceStyle - 1]}`}}</span>
                                        </div>
                                    </div>
                                </div>
                            </slot>
                        </mt-cell>
                </template>
                <p v-show="loading" class="page-infinite-loading">
                    <mt-spinner :size="20" type="snake"></mt-spinner>
                    加载中...
                </p>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓下拉刷新</span>
                    <span v-show="topStatus === 'loading'">
                        <mt-spinner :size="20" type="snake"></mt-spinner>
                    </span>
                </div>
                <!-- <div slot="bottom" class="mint-loadmore-top">
                    <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">上拉加载</span>
                    <span v-show="topStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                    </span>
                </div> -->
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
import { reservationApi } from '@/api'
import { catchError } from '@/util'
import { mapMutations, mapGetters } from 'vuex'
export default {
    data() {
        return {
            loading: false,
            isLoading: false,
            topStatus: '',
            // comprehensiveList: [],
            title: '',
            moveTranslate: 0, // 下拉滑动距离
            translate: 0,
            total: 0, // 总条数
            // sviceStateIndex: ['待施工', '施工中', '质检中', '待付款', '已付款', '已完结'],
            queryParams: {
                // accountSquared: '',
                // operatorId: '',
                // serviceType: '',
                // comprehensiveId: '',
                fromDate: '',
                endDate: '',
                status: '0',
                param: '',
                page: 0,
                pageSize: 20
            },
            serviceStyle: ['到店', '上门']
        }
    },
    computed: {
        ...mapGetters('reservation', ['listData', 'listQueryParams'])
        // ...mapGetters(['Permission'])
    },
    methods: {
        ...mapMutations('reservation', ['SET_LIST', 'SET_PAGENUM', 'SET_LIST_TOTAL', 'SET_CURRENT_ITEM']),
        async handleQuery() {
            // 查询服务单列表
            if (this.isLoading) return false
            this.isLoading = true
            try {
                console.log(this.queryParams.page)
                const { data, meta } = await reservationApi.getList.r(this.queryParams)
                // console.log(res)
                console.log(data)
                console.log(meta)
                this.SET_LIST_TOTAL(meta) // 设置预约单数据总数
                this.total = meta
                // 缓存预约单列表
                if (this.listData.length === 0) {
                    this.SET_LIST(data)
                } else {
                    this.SET_LIST([...this.listData, ...data])
                }
                this.loading = false // 判断是否在请求数据中
                this.isLoading = false // 判断是否在请求数据中
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async loadTop() {
            // 下拉刷新
            console.log('下拉')
            const { data, meta } = await reservationApi.getList.r({
                fromDate: '',
                endDate: '',
                status: '0',
                param: '',
                page: 1,
                pageSize: this.listData.length
            })
            console.log(data)
            console.log(meta)
            this.SET_LIST(data)
            this.SET_LIST_TOTAL(meta)
            this.$refs.loadmore.onTopLoaded()
        },
        loadMore() {
            // 滚动到底部加载, 触发区域在可视区域内触发
            // console.log(this.workQueryParams)
            if (this.isLoading) return false
            console.log('加载..')
            // console.log(this.comprehensiveList.length)
            // console.log(this.workQueryParams.size)
            if (this.listQueryParams.total === 0 || this.listData.length < this.total) {
                console.log(3333)
                console.log(this.listQueryParams.PageNum * this.queryParams.pageSize)
                this.loading = true
                let num = 1
                if (this.listQueryParams.PageNum * this.queryParams.pageSize >= this.listQueryParams.total) {
                    num = 0
                }
                this.SET_PAGENUM(this.listQueryParams.PageNum + num)
                this.queryParams.page = this.listQueryParams.PageNum
                this.handleQuery()
            }
        },
        loadBottom() {
            console.log('上拉')
        },
        allLoaded() {
            console.log('全拉')
        },
        translateChange(translate) {
            // 触发下拉刷新条件
            const translateNum = +translate
            this.translate = translateNum.toFixed(2)
            console.log('translate', this.translate)
            this.moveTranslate = (1 + translateNum / 70).toFixed(2)
            console.log('moveTranslate', this.moveTranslate)
        },
        handleTopChange(status) {
            // 拖拽滑动状态
            console.log('status', status)
            this.moveTranslate = 1
            this.topStatus = status
        },
        handleCheck(item, index) {
            // 查看预约单详细信息
            this.SET_CURRENT_ITEM(item)
            this.$router.push({
                name: 'reservation-details-item',
                query: {
                    id: item.reservationId,
                    index
                }
            })
        },
        handleCreate() {
            this.$router.push({
                name: 'reservation-details-item'
            })
            // 创建预约单
            // this.CHANGE_EDIT_STATE(false)
            // this.SET_CUSTOMER_INFO(null)
            // this.SET_CAR_INFO(null)
            // this.$router.push({ name: 'EditCustomerInfo-item' })
        }
        // async handleSubmitCar(item) {
        //     // 修改服务单状态为已交车
        //     const that = this
        //     try {
        //         const result = await that.$message({
        //             title: '提示',
        //             message: '是否已将车辆交给车主？',
        //             showCancelButton: true
        //         })
        //         if (result === 'confirm') {
        //             await comprehensiveApi.updateSchedule.r({
        //                 billId: item.comprehensiveId,
        //                 status: 6
        //             })
        //             that.$toast({
        //                 message: '已交车',
        //                 iconClass: 'icon icon-success',
        //                 duration: 2000
        //             })
        //             item.status = 6
        //         }
        //     } catch (err) {
        //         console.error(err)
        //         catchError(err)
        //     }
        // },
    },
    created() {
        // this.handleQuery()
        // this.title = this.$route.meta.name
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
.mint-loadmore-top {
    span {
        display: inline-block;
        transition: 0.2s linear;
        vertical-align: middle;
    }
}
.page-infinite-loading {
    text-align: center;
    height: 50px;
    line-height: 50px;
    margin: 0;
    margin-top: -10px;
    div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
}
.r-cell {
    border-bottom: 1px solid #eee;
    .mint-cell-title{
        flex: none;
    }
    .mint-cell-value.is-link {
        margin-right: 0;
    }
}
.my-item{
    padding: 10px 0;
    .info {
        width: 85vw;
        > div {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-content: flex-start;
            &.carUser{
            font-size: 16px;
                color: #000;
                margin-bottom: 10px;
            }
            &.date {
                font-size: 12px;
            }
        }
    }
}
</style>
