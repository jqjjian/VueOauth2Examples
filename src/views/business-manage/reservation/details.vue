<template>
    <div>
        <mt-header fixed :title="$route.meta.name">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'reservation-record-item'})">返回</mt-button>
            <!-- <router-link :to="{name: 'EditCustomerInfo-item'}" slot="right"> -->
            <mt-button @click.native="handleEdit" slot="right">修改</mt-button>
            <!-- </router-link> -->
        </mt-header>
        <div class="container-box">
            <mt-field label="送修人" :disabled="!isEdit" :placeholder="isEdit ? '请输入用户名' : ''" v-model="form.carUserName"></mt-field>
            <mt-field label="手机号" :disabled="!isEdit" :placeholder="isEdit ? '请输入手机号' : ''" type="tel" v-model="form.phone"></mt-field>
            <mt-field label="车牌号码" :disabled="!isEdit" :placeholder="isEdit ? '请输入邮箱' : ''" type="text" v-model="form.carInfo"></mt-field>
            <mt-field label="住址" :disabled="!isEdit" :placeholder="isEdit ? '请输入住址' : ''" type="text" v-model="form.address"></mt-field>
            <mt-field label="预约时间" :disabled="!isEdit" :placeholder="isEdit ? '请输入预约时间' : ''" type="text" v-model="form.reservationTime"></mt-field>
            <mt-field label="服务方式" :disabled="!isEdit" :placeholder="isEdit ? '请输入服务方式' : ''" type="text" v-model="form.serviceStyle"></mt-field>
            <mt-field label="服务项目" :disabled="!isEdit" :placeholder="isEdit ? '请输入服务项目' : ''" type="text" v-model="form.serviceType"></mt-field>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as R from 'ramda'
export default {
    data() {
        return {
            isEdit: false,
            form: {
                carInfo: '桂A9999',
                carUserName: '张三',
                comprehensiveId: 1,
                address: '',
                phone: '15978176964',
                reservationId: 0,
                reservationTime: '2017-06-02 00:00:00',
                serviceStyle: 1,
                serviceType: '1,2',
                status: 1
            }
        }
    },
    computed: {
        ...mapGetters('reservation', ['currentItem'])
    },
    methods: {
        loadMore() {},
        handleEdit() {}
    },
    async created() {
        if (this.currentItem !== null) {
            this.form = R.clone(this.currentItem)
        } else {
            console.log(this.currentItem)
        }
    }
}
</script>

<style lang="postcss">
.container-box {
    padding-top: 44px;
    background: #eee;
}
</style>
