<template>
    <div>
        <mt-header fixed :title="$route.meta.name">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'reservation-record-item'})">返回</mt-button>
            <!-- <router-link :to="{name: 'EditCustomerInfo-item'}" slot="right"> -->
            <!-- <mt-button @click.native="handleEdit" slot="right">修改</mt-button> -->
            <!-- </router-link> -->
        </mt-header>
        <div class="container-box reservation-details">
            <mt-field label="送修人" :disabled="!isEdit" :placeholder="isEdit ? '请输入用户名' : ''" v-model="form.carUserName"></mt-field>
            <mt-field label="手机号" :disabled="!isEdit" :placeholder="isEdit ? '请输入手机号' : ''" type="tel" v-model="form.phone"></mt-field>
            <mt-field label="车牌号码" :disabled="!isEdit" :placeholder="isEdit ? '请输入车牌号码' : ''" type="text" v-model="form.carInfo"></mt-field>
            <mt-field label="住址" :disabled="!isEdit" :placeholder="isEdit ? '请输入住址' : ''" type="text" v-model="form.address"></mt-field>
            <mt-field label="预约时间" :disabled="!isEdit" :placeholder="isEdit ? '请输入预约时间' : ''" type="text" v-model="form.reservationTime"></mt-field>
            <mt-field label="服务方式" disabled :placeholder="isEdit ? '请输入服务方式' : ''" type="text" v-model="serviceStyle[form.serviceStyle - 1]"></mt-field>
            <mt-field label="服务项目" :disabled="!isEdit" :placeholder="isEdit ? '请输入服务项目' : ''" type="text" v-model="form.serviceType"></mt-field>
        </div>
        <div class="reservation-btn-box">
            <mt-button @click.native="handleEdit" size="small" v-if="!isEdit">修改</mt-button>
            <mt-button @click.native="handleSave" type="primary" v-else size="small" style="float: right;">保存</mt-button>
            <mt-button @click.native="handleCreat" v-if="!isEdit" type="primary" size="small" style="float: right;">开单</mt-button>
            <mt-button @click.native="handleCancel " v-else size="small">取消</mt-button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { reservationApi } from '@/api'
import * as R from 'ramda'
export default {
    data() {
        return {
            isEdit: false,
            isAdd: false,
            form: {
                carInfo: '',
                carUserName: '',
                comprehensiveId: '',
                address: '',
                phone: '',
                reservationId: '',
                reservationTime: '',
                serviceStyle: 1,
                serviceType: '',
                status: 1
            },
            index: 0,
            serviceStyle: ['到店', '外出']
        }
    },
    computed: {
        ...mapGetters('reservation', ['currentItem']),
        ...mapGetters('work', ['CustomerInfo', 'isEdited', 'provinces'])
    },
    methods: {
        ...mapMutations('reservation', ['ADD_ITEM', 'SAVE_LIST', 'SET_CURRENT_ITEM']),
        ...mapMutations('work', ['SET_CUSTOMER_INFO', 'CHANGE_EDIT_STATE', 'SET_WORK_ORDER']),
        loadMore() {},
        // 保存修改预约单
        async handleSave() {
            const { data } = await reservationApi.setReservation.r(this.form)
            this.SET_CURRENT_ITEM(data)
            if (this.isAdd) {
                console.log(data)
                this.isAdd = false
                this.ADD_ITEM(data)
            } else {
                this.SAVE_LIST({
                    index: this.index,
                    item: data
                })
            }
            this.form = R.clone(data)
            this.isEdit = false
        },
        // 编辑
        handleEdit() {
            this.isEdit = true
        },
        // 开单
        handleCreat() {
            this.SET_WORK_ORDER({
                comprehensiveId: '',
                orderType: 1,
                remark: '',
                seCustomerInfo: null,
                seCarInfo: null
            })
            this.SET_CUSTOMER_INFO({
                customerName: this.form.carUserName,
                tel: this.form.phone,
                carNumber: this.form.carInfo,
                customerAddress: this.form.address
            })
            this.CHANGE_EDIT_STATE(true)
            this.$router.push({
                name: 'EditCustomerInfo-item'
            })
        },
        // 取消编辑
        async handleCancel() {
            if (this.isAdd) {
                const result = await this.$message({
                    title: '提示',
                    message: '是否放弃已经输入的信息?',
                    showCancelButton: true
                })
                if (result) {
                    this.$router.push({ name: 'reservation-record-item' })
                }
            } else {
                this.form = R.clone(this.currentItem)
            }
            this.isEdit = false
        }
    },
    async created() {
        if (this.currentItem !== null) {
            this.form = R.clone(this.currentItem)
        } else {
            console.log(this.currentItem)
        }
        if (!this.$route.query.id) {
            this.isEdit = true
            this.isAdd = true
            for (let k of Object.keys(this.form)) {
                this.form[k] = ''
            }
            this.form.serviceStyle = 1
            this.form.status = 1
        }
        if (this.$route.query.index) {
            this.index = this.$route.query.index
        }
    }
}
</script>

<style lang="postcss">
.container-box {
    padding-top: 44px;
    background: #eee;
    &.reservation-details {
        input {
            background: #eee;
            &:disabled {
                background: #fff;
            }
        }
    }
}
.reservation-btn-box {
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 50px;
    padding: 8px 8px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
}
</style>
