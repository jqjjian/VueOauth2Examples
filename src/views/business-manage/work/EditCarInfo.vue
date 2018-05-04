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
                <div class="info-title">车辆信息（*必填）</div>
                <template v-for="(v, i) in field">
                    <mt-field :class="{required: popFormRules[v].required}"
                    :key="v + i"
                    :label="`${popFormRules[v].label}：`"
                    v-model="seCustomerInfo[v]"
                    :placeholder="`请输入${popFormRules[v].label}`"
                    :state="popFormRules[v].state"
                    v-input="{label: v, rules}"
                    v-focus="{label: v, event}"></mt-field>
                    <div class="info-error" v-if="popFormRules[v].state === 'error'" :key="v + i + 'err'">{{popFormRules[v].message}}</div>
                </template>
            </div>
            <div class="page-part subBtn">
                <!-- <mt-button type="primary" v-if="comprehensiveStatus === 1" size="large" @click.native="saveSubmit">保存工单</mt-button>
                <br> -->
                <mt-button type="default" size="large" disabled @click.native="handleNext">下一步</mt-button>
            </div>
            <mt-popup :modal="false"
                v-model="selectCarPopupVisible"
                position="right"
                class="mint-popup-select-car"
                popup-transition="popup-fade">
                <mt-index-list v-if="brandCodeData.selectCarindex.length !== 0" ref="list">
                    <template v-for="(v, i) in brandCodeData.selectCarindex">
                        <mt-index-section :index="v" :key="i">
                            <template v-for="(j, k) in brandCodeData.selectCarObj[v].children">
                                <mt-cell :title="j.brandName"
                                :class="[seCustomerInfo.brandCode === j.brandName ? 'active' : '']"
                                :key="k + j.brandName"
                                is-link
                                @click.native="handleSelectCarBrand(j)">
                                    <img slot="icon" :src="j.logoUrl" width="24" height="24">
                                </mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list>
            </mt-popup>
            <mt-popup
            v-model="selectCarTrainPopupVisible"
            popup-transition="popup-fade"
            class="mint-popup-select-list"
            >
                <div class="select-list-wrap" :class="[]">
                    <p style="margin: 5px 0; color: #ccc;padding-left: 10px;">选择车系：</p>
                    <mt-index-list v-if="CarTrainData.CarTrainIndex.length !== 0">
                        <template v-for="(v, i) in CarTrainData.CarTrainIndex">
                            <mt-index-section :index="v" :key="i">
                                <template v-for="(j, k) in CarTrainData.CarTrainObj[v].children">
                                    <mt-cell :title="j.styleName" :class="[]" :key="k" is-link @click.native="handleSelectCarTrain(j)"></mt-cell>
                                </template>
                            </mt-index-section>
                        </template>
                    </mt-index-list>
                </div>
            </mt-popup>
            <div class="selectCarTypeBox" v-if="selectCarPopupVisible" style="z-index: 3000;">
                <mt-button type="default" size="normal" @click="selectCarPopupVisible = false">取消</mt-button>
                <mt-button type="primary" size="normal" @click="checkedCarType">确定</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import { carApi } from '@/api';
import { mapGetters, mapActions } from 'vuex';
import * as R from 'ramda';
export default {
    data() {
        return {
            selectCarPopupVisible: false, // 车品牌列表
            selectCarTrainPopupVisible: false, // 车品牌列表
            CarTrainData: {
                CarTrainIndex: [],
                CarTrainObj: {}
            },
            field: [
                'carType', // 车型
                'carColor', // 车辆颜色
                'appearance', // 车身外观 1 良好 0不正常
                'displacement', // 排量
                'engineNumber', // 发动机号
                'vin', // VIN
                'innage', // 剩余油量
                'mileage', // 行驶里程
                'adviseMileageMaintenance', // 建议保养里程
                'adviseMileageTime' // 建议保养时间
                // 'brandCode', // 品牌编码
                // 'carTrainCode', // 车系
                // 'carModelYear', // 车型年款
            ],
            seCustomerInfo: {
                adviseMileageMaintenance: '',
                adviseMileageTime: '',
                appearance: '',
                brandCode: '',
                carTrainCode: '',
                carModelYear: '',
                carType: '',
                displacement: '',
                engineNumber: '',
                innage: '',
                mileage: '',
                vin: '',
                carColor: ''
            },
            popFormRules: {
                adviseMileageMaintenance: {
                    label: '建议保养里程',
                    required: false,
                    state: ''
                },
                adviseMileageTime: {
                    label: '建议保养时间',
                    required: false,
                    state: ''
                },
                appearance: {
                    label: '车身外观',
                    required: true,
                    message: '车身外观不能为空',
                    state: ''
                },
                brandCode: {
                    label: '品牌车型',
                    required: false,
                    message: '请选择车品牌车型',
                    state: ''
                },
                carTrainCode: {
                    label: '车系',
                    required: false,
                    message: '请选择车系',
                    state: ''
                },
                carModelYear: {
                    label: '车年款',
                    required: false,
                    message: '请选择车年款',
                    state: ''
                },
                carType: {
                    label: '品牌车型',
                    required: true,
                    message: '车品牌车型不能为空',
                    state: ''
                },
                displacement: {
                    label: '排量',
                    required: true,
                    message: '排量不能为空',
                    state: ''
                },
                engineNumber: {
                    label: '发动机号',
                    required: true,
                    message: '发动机号不能为空',
                    state: ''
                },
                innage: {
                    label: '剩余油量',
                    required: true,
                    message: '剩余油量不能为空',
                    state: ''
                },
                mileage: {
                    label: '行驶里程',
                    required: true,
                    message: '行驶里程不能为空',
                    state: ''
                },
                vin: {
                    label: 'vin码',
                    required: true,
                    message: 'vin码不能为空',
                    state: ''
                },
                carColor: {
                    label: '车辆颜色',
                    required: true,
                    message: '车辆颜色不能为空',
                    state: ''
                }
                // customerName: {
                //     label: '送修人名称',
                //     required: true,
                //     message: '送修人名称不能为空',
                //     state: ''
                // },
                // tel: {
                //     label: '手机号码',
                //     required: true,
                //     message: '手机号码必须是11位数字',
                //     state: '',
                //     rex: /^\d{11}$/g
                // },
                // carNumber: {
                //     label: '车牌号码',
                //     required: true,
                //     message: '车牌号码不能空',
                //     state: ''
                // },
                // customerAddress: {
                //     label: '住址',
                //     required: false,
                //     state: ''
                // }
            }
        };
    },
    computed: {
        ...mapGetters('work', ['brandCodeData'])
    },
    methods: {
        ...mapActions('work', ['getBrandCode']),
        checkedCarType() {
            console.log(111);
        },
        rules(v) { // 验证
            console.log(v);
        },
        event(v) {
            console.log(v);
            if (v === 'carType') {
                this.selectCarPopupVisible = true;
                if (this.brandCodeData.selectCarindex.length === 0) {
                    this.getBrandCode();
                }
            }
        },
        handleNext() {
            console.log('下一步');
        },
        async handleSelectCarBrand (item) {
            console.log(item);
            const { data } = await carApi.requestStyle.r({brandId: item.id});
            console.log(data);
            this.selectCarTrainPopupVisible = true;
            this.CarTrainData.CarTrainIndex = [...new Set(R.map(R.prop('factoryName'))(data))];
            for (let v of data) {
                if (this.CarTrainData.CarTrainObj[v.factoryName]) {
                    this.CarTrainData.CarTrainObj[v.factoryName].children.push(v);
                } else {
                    this.CarTrainData.CarTrainObj[v.factoryName] = {
                        children: [v]
                    };
                }
            }
        },
        async handleSelectCarTrain(item) {
            console.log(item);
        }
    },
    created() {
        // if(this.selectCarindex.length === 0) {
        //     this.getBrandCode();
        // }
    }
};
</script>

<style lang="postcss">
 .selectCarTypeBox {
    position: fixed;
    background: rgba(0, 0, 0, .3);
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 0;
    text-align: center;
    .mint-button {
        margin: 4px 10px 0;
    }
}
.mint-popup-select-list {
    width: 100%;
    height: 100%;
    -webkit-transform: translate3d(-12%,-50%,0);
    transform: translate3d(0,-50%,0);
    .mint-indexlist-content {
        > li:last-child {
            margin-bottom: 50px;
        }
    }
}
</style>
