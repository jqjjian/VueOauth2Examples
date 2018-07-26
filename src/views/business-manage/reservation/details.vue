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
            <mt-field label="车牌号码" :disabled="!isEdit" :placeholder="isEdit ? '请输入邮箱' : ''" type="text" v-model="form.carInfo"></mt-field>
            <mt-field label="住址" :disabled="!isEdit" :placeholder="isEdit ? '请输入住址' : ''" type="text" v-model="form.address"></mt-field>
            <mt-field label="预约时间" :disabled="!isEdit" :placeholder="isEdit ? '请输入预约时间' : ''" type="text" v-model="form.reservationTime"></mt-field>
            <mt-field label="服务方式" disabled :placeholder="isEdit ? '请输入服务方式' : ''" type="text" v-model="serviceStyle[form.serviceStyle - 1]"></mt-field>
            <mt-field label="服务项目" :disabled="!isEdit" :placeholder="isEdit ? '请输入服务项目' : ''" type="text" v-model="form.serviceType"></mt-field>
        </div>
        <div class="reservation-btn-box">
            <mt-button @click.native="handleEdit" size="small" v-if="!isEdit">修改</mt-button>
            <mt-button @click.native="handleSave" v-else size="small">保存</mt-button>
            <mt-button @click.native="handleCreat" type="primary" size="small" style="float: right;">开单</mt-button>
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
        ...mapGetters('reservation', ['currentItem'])
    },
    methods: {
        ...mapMutations('reservation', ['ADD_ITEM', 'SAVE_LIST']),
        loadMore() {},
        async handleSave() {
            const { data } = await reservationApi.setReservation.r(this.form)
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
        handleEdit() {
            this.isEdit = true
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
