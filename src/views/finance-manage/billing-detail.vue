<template>
    <div>
        <mt-header fixed title="订单详情">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
        </mt-header>
        <div class="container-box scroll">
            <div>
                <mt-cell title="单号" :value="info.comprehensiveCd"></mt-cell>
                <mt-cell title="车牌号码" :value="info.seCustomerInfo.carNumber"></mt-cell>
                <mt-cell title="品牌">{{info.seCarInfo.brandCode}}</mt-cell>
                <mt-cell title="型号">{{info.seCarInfo.carTrainCode}}/{{info.seCarInfo.carType}}</mt-cell>
                <mt-cell title="VIN码">{{info.seCarInfo.vin}}</mt-cell>
                <mt-cell title="发动机号">{{info.seCarInfo.engineNumber}}</mt-cell>
                <mt-cell title="开单时间">{{info.createDate}}</mt-cell>
                <mt-cell title="服务经理"></mt-cell>
            </div>
            <div style="margin-top:10px;">
                <mt-cell title=""></mt-cell>
                <mt-cell title=""></mt-cell>
                <mt-cell title=""></mt-cell>
                <mt-cell title=""></mt-cell>
                <mt-cell title=""></mt-cell>
                <mt-cell title=""></mt-cell>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: 'msg',
            info: {}
        };
    },
    created() {
        console.log(this.$route.params.info);
        if (this.$route.params.info) {
            this.info = this.$route.params.info;
        }
    }
};
</script>