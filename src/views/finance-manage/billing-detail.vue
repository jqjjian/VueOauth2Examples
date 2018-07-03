<template>
    <div>
        <mt-header fixed title="订单详情">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
        </mt-header>
        <div class="container-box scroll" style="padding-bottom: 80px;">
            <div class="ycy-cell-red">
                <mt-cell v-if="info.status===4" title="状态" :value="info.status===4?'未结账':''"></mt-cell>
                <mt-cell v-if="info.status===5" title="状态" value="已结账"></mt-cell>
            </div>
            <div class="ycy-cell-detail" style="margin-top:10px;">
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
                <div v-for="(item,index) in info.seProjectList" :key="index" style="border-bottom: 1px solid #eeeeee;">
                    <mt-cell class="ycy-cell-blue" :title="item.projectName+' - '+item.description"></mt-cell>
                    <div class="ycy-cell-detail">
                        <mt-cell v-for="(j,i) in item.children" :key="i" :title="j.classifyId==0?'工时费':j.materialName" :value="j.classifyId==0||!j.classifyId?j.price:j.price + ' * ' + j.number"></mt-cell>
                    </div>
                </div>
            </div>
            <div v-if="info.status===4" style="margin-top:10px;">
                <my-radio title="选择支付方式" v-model="payType" :options="options">
                </my-radio>
                <!-- <div style="font-size: 0.8rem; padding: 10px 5px;">请在对应的支付方式输入金额</div>
                <mt-field label=" 现金" type="number" v-model="payType.Cash"></mt-field>
                <mt-field label="刷卡" type="number" v-model="payType.Card"></mt-field>
                <mt-field label="支票" type="number" v-model="payType.Cheque"></mt-field>
                <mt-field label="银行转账" type="number" v-model="payType.Transfer"></mt-field>
                <mt-field label="支付宝" type="number" v-model="payType.Alipay"></mt-field>
                <mt-field label="微信" type="number" v-model="payType.WeChatPay"></mt-field>
                <mt-field label="挂账" type="number" v-model="payType.Arrears"></mt-field>
                <mt-field label="网络支付" type="number" v-model="payType.InternetPay"></mt-field>
                <mt-field label="备注" type="textarea" rows="2" v-model="payType.remark"></mt-field>
                <mt-field label="收款时间" readonly v-model="payDate"></mt-field> -->
            </div>
        </div>
        <div class="finance-buttom">
            <div>
                <span>总金额: {{info.totalFee}}元</span>
            </div>
            <!-- <div v-if="info.status===4">
                <span>剩余应付: {{extendedAmount}}元</span>
                <mt-button size="small" :disabled="extendedAmount!=0" @click.native="accountBilling()">确认付款</mt-button>
            </div> -->
            <mt-button size="small" :disabled="extendedAmount!=0" @click.native="accountBilling()">确认付款</mt-button>
        </div>
        <mt-popup v-model="visible" popup-transition="popup-fade" class="mint-popup-select-list">
            <div v-html="html" style="width: 300px; height: 300px;"></div>
        </mt-popup>
    </div>
</template>
<script>
import { accountApi } from '@/api'
import MyRadio from '@/components/radio'
import { mapGetters } from 'vuex'
export default {
    components: {
        MyRadio
    },
    data() {
        return {
            visible: false,
            html: '',
            value: '',
            msg: 'msg',
            info: {},
            payParams: {
                // comprehensiveId: null,
                // Cash: null, // 现金
                // Card: null, // 刷卡
                // Cheque: null, // 支票
                // Transfer: null, // 银行转账
                // Alipay: null, // 支付宝
                // WeChatPay: null, // 微信支付
                // Arrears: null, // 挂账
                // InternetPay: null, // 网络支付
                // remark: '',
                // type: ''
                outTradeNo: '',
                shopId: '',
                totalAmount: 0,
                returnUrl: 'https://www.baidu.com'
            },
            payType: '',
            options: [
                {
                    label: '支付宝',
                    value: 'alipay',
                    icon: 'fa-zhifubao'
                },
                {
                    label: '微信',
                    value: 'wxpay',
                    icon: 'fa-wxpay'
                }
            ]
        }
    },
    computed: {
        ...mapGetters('oauth', ['loginUser']),
        extendedAmount() {
            // let total = 0
            // let tt =
            //     this.info.totalFee -
            //     this.payType.Cash -
            //     this.payType.Card -
            //     this.payType.Cheque -
            //     this.payType.Transfer -
            //     this.payType.Alipay -
            //     this.payType.WeChatPay -
            //     this.payType.Arrears -
            //     this.payType.InternetPay
            // total = Math.floor(parseFloat(tt * 100)) / 100
            // if (this.info.totalFee === 0 || this.payType === '') {
            //     return true
            // } else {
            //     return false
            // }
            return this.info.totalFee === 0 || this.payType === '' ? 1 : 0
        },
        payDate() {
            let myDate = new Date()
            let minute = ''
            let separate = '-'
            let dt = ''
            minute =
                (myDate.getHours() < 10 ? ' 0' : ' ') +
                myDate.getHours() +
                ':' +
                (myDate.getMinutes() < 10 ? '0' : '') +
                myDate.getMinutes()
            dt =
                myDate.getFullYear() +
                separate +
                (myDate.getMonth() + 1) +
                separate +
                (myDate.getDate() < 10 ? '0' : '') +
                myDate.getDate() +
                minute
            return dt
        }
    },
    created() {
        if (this.$route.params.info) {
            this.info = this.$route.params.info
            console.log(this.info)
        }
    },
    methods: {
        async accountBilling() {
            this.payParams.outTradeNo = this.info.comprehensiveId
            this.payParams.totalAmount = this.info.totalFee
            this.payParams.shopId = this.loginUser.shops[0].uuid
            console.log(this.loginUser)
            const qr = await accountApi.toAliPay.r(this.payParams)
            // console.log(qr)
            // this.html = qr
            // this.visible = true
            // document.forms[0].submit();
            const div = window.document.createElement('div')
            div.innerHTML = qr
            document.body.appendChild(div)
            document.forms[0].submit()
            // accountApi.saveAccount.r(this.payType).then(response => {
            //     console.log(response)
            //     if (response.status === 200) {
            //         this.collectionVisible = false
            //         this.$message({
            //             message: '付款成功',
            //             type: 'success'
            //         })
            //         this.getNotPaid()
            //     } else {
            //         this.$message({
            //             message: '付款失败',
            //             type: 'error'
            //         })
            //     }
            // })
        }
    }
}
</script>
<style lang="postcss">
.ycy-cell-detail .mint-cell {
    min-height: 32px;
}
.ycy-cell-red .mint-cell-value {
    color: red;
}
.ycy-cell-blue {
    color: #26a1ff;
}
.finance-buttom {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: right;
    display: flex;
    justify-content: space-between;
    /* align-content: center; */
    align-items: center;
    color: #ffffff;
}
</style>
