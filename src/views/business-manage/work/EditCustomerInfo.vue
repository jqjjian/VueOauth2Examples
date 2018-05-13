<template>
    <div>
        <mt-header fixed :title="$route.meta.name" style="font-size: 16px;">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
                <mt-button >开单</mt-button>
            </router-link> -->
        </mt-header>
        <div class="container-box scroll">
            <div class="page-part form">
                <div class="info-title">送修人信息（*必填）</div>
                <template v-for="(v, i) in field">
                    <mt-field :class="{required: popFormRules[v].required}"
                    :key="v + i"
                    :label="`${popFormRules[v].label}：`"
                    v-model="seCustomerInfo[v]"
                    :placeholder="`请输入${popFormRules[v].label}`"
                    :state="popFormRules[v].state" v-input="{label: v, rules}"></mt-field>
                    <div class="info-error" v-if="popFormRules[v].state === 'error'" :key="v + i + 'err'">{{popFormRules[v].message}}</div>
                </template>
            </div>
            <div class="page-part subBtn">
                <mt-button type="primary" size="large" :disabled="!finish" @click.native="handleNext">下一步</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import * as R from 'ramda';
export default {
    data() {
        return {
            field: ['customerName', 'tel', 'carNumber', 'customerAddress'],
            seCustomerInfo: {
                customerName: '',
                tel: '',
                carNumber: '',
                customerAddress: ''
            },
            popFormRules: {
                customerName: {
                    label: '送修人名称',
                    required: true,
                    message: '送修人名称不能为空',
                    state: ''
                },
                tel: {
                    label: '手机号码',
                    required: true,
                    message: '手机号码必须是11位数字',
                    state: '',
                    rex: /^\d{11}$/g
                },
                carNumber: {
                    label: '车牌号码',
                    required: true,
                    message: '车牌号码不能空',
                    state: ''
                },
                customerAddress: {
                    label: '住址',
                    required: false,
                    state: ''
                }
            }
        };
    },
    computed: {
        ...mapGetters('work', ['CustomerInfo', 'isEdited']),
        finish() {
            let b = true;
            for (let v of Object.values(this.popFormRules)) {
                if (v.required && v.state !== 'success') {
                    b = false;
                }
            }
            return b;
        }
    },
    methods: {
        ...mapMutations('work', ['SET_CUSTOMER_INFO', 'CHANGE_EDIT_STATE']),
        ...mapActions('work', ['getComprehensive']),
        rules(e) { // 验证
            const popFormRules = this.popFormRules;
            if (popFormRules[e].required) {
                if (this.seCustomerInfo[e] === '') {
                    popFormRules[e].state = 'error';
                    return;
                } else if (popFormRules[e].rex) {
                    if (!popFormRules[e].rex.test(this.seCustomerInfo[e])) {
                        popFormRules[e].state = 'error';
                        return;
                    }
                }
            }
            popFormRules[e].state = 'success';
        },
        handleNext() {
            console.log('下一步');
            this.SET_CUSTOMER_INFO(this.seCustomerInfo);
            this.$router.push({name: 'EditCarInfo-item'});
            // this.CHANGE_EDIT_STATE(true);
            // const tag = false;
            // if (tag) {
            //     this.$router.back(-1);
            // } else {
            //     this.$router.push({name: 'EditCarInfo-item'});
            // }
        }
    },
    watch: {
        // seCustomerInfo: {
        //     handler(cur, old) {
        //         console.log(cur, old);
        //     },
        //     deep: true
        // }
    },
    created() {
        if (this.CustomerInfo !== null) {
            this.seCustomerInfo = R.merge(this.seCustomerInfo, this.CustomerInfo);
        }
        if (this.isEdited) {
            for (let k of Object.keys(this.seCustomerInfo)) {
                if (this.popFormRules[k].required) {
                    this.popFormRules[k].state = 'success';
                }
            }
        }
    }
};
</script>

<style lang="postcss">
.page-part.form {
    .mint-field {
        .mint-cell-title {
            width: 115px;
        }
    }
}
</style>
