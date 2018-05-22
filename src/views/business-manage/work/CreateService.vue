<template>
    <div>
        <mt-header fixed :title="title" style="font-size: 16px;">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
                <mt-button >开单</mt-button>
            </router-link> -->
        </mt-header>
        <div class="container-box scroll">
            <div class="page-part">
                <mt-cell title="送修人信息" is-link :value="`姓名+手机号+车牌号...`" :to="{name: 'EditCustomerInfo-item'}"></mt-cell>
                <mt-cell title="车辆信息" is-link :value="`车型+排量+发动机号...`" :to="{name: 'EditCarInfo-item'}"></mt-cell>
            </div>
            <div class="page-part subBtn">
                <!-- <mt-button type="primary" v-if="comprehensiveStatus === 1" size="large" @click.native="saveSubmit">保存工单</mt-button>
                <br> -->
                <mt-button type="default" size="large" disabled @click.native="comprehensiveSubmit">提交</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '服务开单'
        }
    },
    methods: {
        comprehensiveSubmit() {
            console.log('开单')
        }
    }
}
</script>

<style lang="postcss">
</style>
