<template>
    <div>
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'business-manage'})">返回</mt-button>
            <!-- <router-link :to="{name: 'EditCustomerInfo-item'}" slot="right"> -->
            <mt-button @click.native="handleCreate" slot="right">开单</mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="container-box" v-infinite-scroll="loadMore" :infinite-scroll-distance="10">
            <mt-loadmore style="" :top-method="loadTop" @translate-change="translateChange" @top-status-change="handleTopChange" ref="loadmore" >
                <template v-for="(v, i) in comprehensiveList">
                    <div class="page-part" :key="i">
                        <mt-cell :title="`${v.seCustomerInfo.carNumber}(${v.seCarInfo.brandCode})`" :is-link="v.status !== 5" :label="`${Permission.vis.hasOwnProperty('customerInformation') ? v.seCustomerInfo.customerName : ''} ${v.createDate}`" @click.native="handleEditComprehensive(v.comprehensiveId)">
                            <mt-button type="primary" size="small" v-if="v.status === 5" @click.native.stop="handleSubmitCar(v)">交车</mt-button>
                            <span v-else>{{sviceStateIndex[v.status - 1]}}</span>
                        </mt-cell>
                    </div>
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
import { comprehensiveApi } from '@/api'
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
            moveTranslate: 0,
            translate: 0,
            meta: 0,
            sviceStateIndex: ['待施工', '施工中', '质检中', '待付款', '已付款', '已完结'],
            queryParams: {
                // accountSquared: '',
                // operatorId: '',
                // serviceType: '',
                // comprehensiveId: '',
                fromDate: '',
                endDate: '',
                orderType: 0,
                orderStyle: 0,
                status: '1,2,3,4,5',
                param: '',
                page: 0,
                pageSize: 20
            }
        }
    },
    computed: {
        ...mapGetters('work', ['comprehensiveList', 'workQueryParams']),
        ...mapGetters(['Permission'])
    },
    methods: {
        ...mapMutations('work', [
            'SET_CUSTOMER_INFO',
            'SET_CAR_INFO',
            'CHANGE_EDIT_STATE',
            'SET_WORK_LIST',
            'SET_WORK_PAGENUM',
            'SET_WORK_LIST_SIZE'
        ]),
        async loadTop() {
            // 下拉刷新
            console.log('下拉')
            const { data, meta } = await comprehensiveApi.request.r({
                // accountSquared: '',
                // operatorId: '',
                // serviceType: '',
                // comprehensiveId: '',
                fromDate: '',
                endDate: '',
                orderType: 0,
                orderStyle: 0,
                status: '1,2,3,4',
                param: '',
                page: 1,
                pageSize: this.comprehensiveList.length
            })
            console.log(data)
            console.log(meta)
            this.SET_WORK_LIST(data)
            this.SET_WORK_LIST_SIZE(meta)
            this.$refs.loadmore.onTopLoaded()
        },
        loadMore() {
            // 滚动到底部加载, 触发区域在可视区域内触发
            console.log(this.workQueryParams)
            if (this.isLoading) return false
            console.log('加载..')
            console.log(this.comprehensiveList.length)
            console.log(this.workQueryParams.size)
            if (this.workQueryParams.size === 0 || this.comprehensiveList.length < this.meta) {
                console.log(3333)
                console.log(this.workQueryParams.workPageNum * this.queryParams.pageSize)
                this.loading = true
                let num = 1
                if (this.workQueryParams.workPageNum * this.queryParams.pageSize >= this.workQueryParams.size) {
                    num = 0
                }
                this.SET_WORK_PAGENUM(this.workQueryParams.workPageNum + num)
                this.queryParams.page = this.workQueryParams.workPageNum
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
        handleEditComprehensive(id) {
            // 查看服务单详细信息
            this.CHANGE_EDIT_STATE(false)
            this.$router.push({
                name: 'work-services-item',
                query: {
                    id
                }
            })
        },
        handleCreate() {
            // 创建服务单
            this.CHANGE_EDIT_STATE(false)
            this.SET_CUSTOMER_INFO(null)
            this.SET_CAR_INFO(null)
            this.$router.push({ name: 'EditCustomerInfo-item' })
        },
        async handleSubmitCar(item) {
            // 修改服务单状态为已交车
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
            // 查询服务单列表
            if (this.isLoading) return false
            this.isLoading = true
            try {
                console.log(this.queryParams.page)
                const { data, meta } = await comprehensiveApi.request.r(this.queryParams)
                console.log(data)
                console.log(meta)
                this.SET_WORK_LIST_SIZE(meta) // 设置服务单数据总数
                this.meta = meta

                // 缓存服务单列表
                if (this.comprehensiveList.length === 0) {
                    this.SET_WORK_LIST(data)
                } else {
                    this.SET_WORK_LIST([...this.comprehensiveList, ...data])
                }
                this.loading = false // 判断是否在请求数据中
                this.isLoading = false // 判断是否在请求数据中
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        }
    },
    created() {
        // this.handleQuery()
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
</style>
