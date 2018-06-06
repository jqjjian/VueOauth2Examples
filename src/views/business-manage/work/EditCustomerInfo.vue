<template>
    <div>
        <mt-header fixed :title="$route.meta.name">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
                <mt-button >开单</mt-button>
            </router-link> -->
        </mt-header>
        <div class="container-box scroll">
            <div class="page-part form">
                <div class="info-title">送修人信息（*必填）</div>
                <template v-for="(v, i) in field">
                    <mt-field v-if="v !== 'carNumber'" :class="{required: popFormRules[v].required}" :key="v + i" :label="`${popFormRules[v].label}：`" v-model="seCustomerInfo[v]" :placeholder="`请输入${popFormRules[v].label}`" :readonly="popFormRules[v].readonly" :type="popFormRules[v].type" :state="popFormRules[v].state" v-blur="{label: v, rules}">
                        <!-- <mt-button v-if="v === 'carNumber'" type="primary" size="small" class="checked">{{province}}</mt-button> -->
                    </mt-field>
                    <mt-cell v-else title="车牌号码：" :key="v + i" class="carNum" :class="{required: popFormRules[v].required}">
                        <mt-button type="primary" size="small" class="checked" @click.native="popupVisible = true">{{province}}</mt-button>
                        <input :readonly="popFormRules[v].readonly" type="text" class="mint-field-core" :placeholder="`输入${popFormRules[v].label}`" style="margin-left: 5px;" v-model="seCustomerInfo[v]" @blur="rules(v)" />
                        <span class="mint-field-state" v-if="popFormRules[v].state" :class="['is-' + popFormRules[v].state]">
                            <i class="mintui" :class="['mintui-field-' + popFormRules[v].state]"></i>
                        </span>
                    </mt-cell>
                    <div class="info-error" v-if="popFormRules[v].state === 'error'" :key="v + i + 'err'">{{popFormRules[v].message}}</div>
                </template>
            </div>
            <div class="page-part subBtn">
                <mt-button type="primary" size="large" :disabled="!finish" @click.native="handleNext">下一步</mt-button>
            </div>
        </div>
        <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom" class="my-popup">
            <div class="car-province" style="height: 250px; padding: 5px 5px 0;">
                <template v-for="(v, i) in this.provinces">
                    <div v-if="(i !== 0) && (i % 7 === 0)" class="car-province" style="width: 100%" :key="v.groupCode + `${i}`"> </div>
                    <mt-button type="primary" size="small" style="margin-bottom: 5px;" :key="v.dicName" @click.native="handleSelectProvince(v.dicName)">{{v.dicName}}</mt-button>
                </template>
                <mt-button type="primary" size="large" @click.native="popupVisible = false">取消</mt-button>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as R from 'ramda'
export default {
    data() {
        return {
            popupVisible: false,
            province: '桂',
            carNumVal: '',
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
                    type: 'text',
                    readonly: false,
                    message: '送修人名称不能为空',
                    state: ''
                },
                tel: {
                    label: '手机号码',
                    required: true,
                    type: 'number',
                    readonly: false,
                    message: '手机号码必须是11位数字',
                    state: '',
                    rex: /^\d{11}$/
                },
                carNumber: {
                    label: '车牌号码',
                    required: true,
                    type: 'text',
                    readonly: false,
                    message: '车牌号码不能为空或不正确',
                    state: '',
                    rex: /^[0-9a-zA-Z]{6,7}$/
                },
                customerAddress: {
                    label: '住址',
                    type: 'text',
                    readonly: false,
                    required: false,
                    state: ''
                }
            },
            time: null
        }
    },
    computed: {
        ...mapGetters('work', ['CustomerInfo', 'isEdited', 'provinces']),
        finish() {
            let b = true
            for (let v of Object.values(this.popFormRules)) {
                if (v.required && v.state !== 'success') {
                    b = false
                }
            }
            return b
        }
    },
    methods: {
        ...mapMutations('work', ['SET_CUSTOMER_INFO', 'CHANGE_EDIT_STATE']),
        ...mapActions('work', ['getComprehensive', 'getProvince']),
        rules(e) {
            // 验证
            const popFormRules = this.popFormRules
            if (popFormRules[e].required) {
                if (this.seCustomerInfo[e] === '') {
                    console.log(1111)
                    popFormRules[e].state = 'error'
                    return
                } else if (popFormRules[e].rex) {
                    if (!popFormRules[e].rex.test(this.seCustomerInfo[e])) {
                        console.log(this.seCustomerInfo[e])
                        popFormRules[e].state = 'error'
                        return
                    }
                }
            }
            if (e === 'carNumber') {
                this.seCustomerInfo[e] = this.seCustomerInfo[e].toUpperCase()
            }
            this.seCustomerInfo[e] = this.seCustomerInfo[e].replace(/(^\s+)|(\s+$)/g, '')
            popFormRules[e].state = 'success'
        },
        // verify(v) {
        //     console.log(v);
        // },
        // handleInput(v) {
        // this.carNumVal = evt.target.value;
        // if (this.time !== null) {
        //     window.clearTimeout(this.time)
        // }
        // this.time = setTimeout(() => this.rules(v), 1000)
        // },
        handleNext() {
            console.log('下一步')
            // if (!this.isEdited) {
            // }
            this.seCustomerInfo.carNumber = this.province + this.seCustomerInfo.carNumber
            this.SET_CUSTOMER_INFO(this.seCustomerInfo)
            this.$router.push({ name: 'EditCarInfo-item' })
            // this.CHANGE_EDIT_STATE(true);
            // const tag = false;
            // if (tag) {
            //     this.$router.back(-1);
            // } else {
            //     this.$router.push({name: 'EditCarInfo-item'});
            // }
        },
        handleSelectProvince(name) {
            this.province = name
            this.popupVisible = false
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
        // 判断是新开单或是编辑工单
        if (this.CustomerInfo !== null && this.isEdited) {
            this.seCustomerInfo = R.merge(this.seCustomerInfo, this.CustomerInfo)
            this.province = this.seCustomerInfo.carNumber.slice(0, 1)
            this.seCustomerInfo.carNumber = this.seCustomerInfo.carNumber.slice(1, 8)
        }
        if (this.isEdited) {
            for (let k of Object.keys(this.seCustomerInfo)) {
                if (this.popFormRules[k] && this.popFormRules[k].required) {
                    this.popFormRules[k].state = 'success'
                }
            }
        }

        // 获取车牌区号
        if (!this.provinces.length) {
            this.getProvince()
        }
    }
}
</script>

<style lang="postcss">
.page-part.form {
    .mint-field {
        .mint-cell-title {
            width: 115px;
        }
    }
}
.mint-cell.carNum {
    .mint-cell-title {
        width: 115px;
        flex: none;
    }
    .mint-cell-value {
        width: 100%;
    }
}
.my-popup {
    width: 100%;
    .picker-slot-wrapper,
    .picker-item {
        backface-visibility: hidden;
    }
}
.car-province {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: flex-start;
}
</style>
