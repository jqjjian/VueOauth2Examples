<template>
    <div>
        <mt-header fixed :title="$route.meta.name" style="font-size: 16px;">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
                <mt-button >开单</mt-button>
            </router-link> -->
        </mt-header>
        <div class="container-box scroll">
            <div class="selectCarTypeBox" style="z-index: 3000;" v-if="PopupVisible.btn">
                <mt-button type="default" size="normal" @click="hidePopup">取消</mt-button>
                <mt-button type="primary" size="normal" @click="handleSelected">确定</mt-button>
            </div>
            <div class="page-part form">
                <div class="info-title">车辆信息（*必填）</div>
                <template v-for="(v, i) in field">
                    <mt-field :class="{required: popFormRules[v].required}" :key="v + i" :label="`${popFormRules[v].label}：`" v-model="seCarInfo[v]" :placeholder="`请输入${popFormRules[v].label}`" :readonly="popFormRules[v].readonly" :disabled="popFormRules[v].readonly" :type="popFormRules[v].type" :state="popFormRules[v].state" v-input="{label: v, rules}" v-focus="{label: v, event}"></mt-field>
                    <div class="info-error" v-if="popFormRules[v].state === 'error'" :key="v + i + 'err'">{{popFormRules[v].message}}</div>
                </template>
            </div>
            <div class="page-part form">
                <mt-field label="备注：" v-model="remark" placeholder="请输入备注" :state="remark !== '' ? 'success' : ''"></mt-field>
            </div>
            <div class="page-part subBtn">
                <!-- <mt-button type="primary" v-if="comprehensiveStatus === 1" size="large" @click.native="saveSubmit">保存工单</mt-button>
                <br> -->
                <mt-button type="primary" size="large" :disabled="!finish" @click.native="handleNext">完成</mt-button>
            </div>
            <mt-popup :modal="false" v-model="PopupVisible.selectCar" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
                <mt-index-list v-if="brandCodeData.selectCarindex.length !== 0" ref="list">
                    <template v-for="(v, i) in brandCodeData.selectCarindex">
                        <mt-index-section :index="v" :key="i">
                            <template v-for="(j, k) in brandCodeData.selectCarObj[v].children">
                                <mt-cell :title="j.brandName" :class="[seCarInfo.brandCode === j.brandName ? 'active' : '']" :key="k + j.brandName" is-link @click.native="handleSelectCarBrand(j)">
                                    <img slot="icon" :src="j.logoUrl" width="24" height="24">
                                </mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list>
            </mt-popup>
            <mt-popup v-model="PopupVisible.selectCarTrain" popup-transition="popup-fade" class="mint-popup-select-list">
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
            <mt-popup v-model="PopupVisible.selectCarYear" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap" :class="['']">
                    <mt-radio title="选择年份：" v-model="seCarInfo.carModelYear" :options="CarYeaIndex" @change="handleSelectCarModelYear">
                    </mt-radio>
                </div>
            </mt-popup>
            <mt-popup v-model="PopupVisible.selectCarType" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap car-type" style="font-size: 12px;" :class="['']">
                    <mt-radio title="选择车款：" v-model="seCarInfo.carType" :options="CarTypeIndex" @change="handleSelectCarType">
                    </mt-radio>
                </div>
            </mt-popup>
            <mt-popup v-model="PopupVisible.selectcarColor" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap" :class="['']">
                    <mt-radio title="选择车辆颜色：" v-model="seCarInfo.carColor" :options="carColors">
                    </mt-radio>
                </div>
            </mt-popup>
            <mt-popup v-model="PopupVisible.selectappearance" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap" :class="['']">
                    <mt-radio title="选择车辆外观：" v-model="seCarInfo.appearance" :options="appearances">
                    </mt-radio>
                </div>
            </mt-popup>
            <mt-popup v-model="PopupVisible.selectinnage" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap" :class="['']">
                    <mt-radio title="选择车辆外观：" v-model="seCarInfo.innage" :options="innages">
                    </mt-radio>
                </div>
            </mt-popup>
            <mt-datetime-picker @confirm="handleConfirm" ref="picker" type="date" v-model="datetime" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
            </mt-datetime-picker>
        </div>
    </div>
</template>

<script>
import { carApi, comprehensiveApi } from '@/api'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import * as R from 'ramda'
export default {
    data() {
        return {
            currentField: '', // 当前编辑内容
            remark: '', // 服务单备注
            PopupVisible: {
                // 弹层
                btn: false,
                selectCar: false, // 车品牌列表
                selectCarTrain: false, // 车品牌列表
                selectCarYear: false, // 车年款
                selectCarType: false, // 车型
                selectcarColor: false, // 车身颜色
                selectappearance: false, // 车身外观
                selectinnage: false // 剩余油量
            },
            CarTrainData: {
                // 车系缓存数据
                CarTrainIndex: [],
                CarTrainObj: {},
                carTrainCode: ''
            },
            CarYeaIndex: [], // 年款缓存
            CarTypeIndex: [], // 车型缓存
            datetime: '',
            field: [
                'myCar', // 车型（全）
                // 'carType', // 车型
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
            carColors: [
                {
                    label: '银色',
                    value: '银色'
                },
                {
                    label: '白色',
                    value: '白色'
                },
                {
                    label: '蓝色',
                    value: '蓝色'
                },
                {
                    label: '黑色',
                    value: '黑色'
                },
                {
                    label: '红色',
                    value: '红色'
                },
                {
                    label: '绿色',
                    value: '绿色'
                },
                {
                    label: '黄色',
                    value: '黄色'
                },
                {
                    label: '棕色',
                    value: '棕色'
                },
                {
                    label: '灰色',
                    value: '灰色'
                },
                {
                    label: '紫色',
                    value: '紫色'
                }
            ],
            appearances: [
                {
                    label: '不正常',
                    value: '不正常'
                },
                {
                    label: '良好',
                    value: '良好'
                }
            ],
            innages: [
                { value: '空', label: '空' },
                { value: '1/4', label: '1/4' },
                { value: '1/2', label: '1/2' },
                { value: '3/4', label: '3/4' },
                { value: '满', label: '满' }
            ],
            seCarInfo: {
                adviseMileageMaintenance: '',
                adviseMileageTime: '',
                appearanceValue: '',
                appearance: '',
                brandCode: '',
                carTrainCode: '',
                carModelYear: '',
                carType: '',
                myCar: '',
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
                    type: 'number',
                    readonly: false,
                    state: ''
                },
                adviseMileageTime: {
                    label: '建议保养时间',
                    required: false,
                    type: 'text',
                    readonly: true,
                    state: ''
                },
                appearance: {
                    label: '车身外观',
                    required: true,
                    type: 'text',
                    readonly: true,
                    message: '车身外观不能为空',
                    state: ''
                },
                brandCode: {
                    label: '品牌车型',
                    required: false,
                    type: 'text',
                    readonly: true,
                    message: '请选择车品牌车型',
                    state: ''
                },
                carTrainCode: {
                    label: '车系',
                    required: false,
                    type: 'text',
                    readonly: true,
                    message: '请选择车系',
                    state: ''
                },
                carModelYear: {
                    label: '车年款',
                    required: false,
                    type: 'text',
                    readonly: true,
                    message: '请选择车年款',
                    state: ''
                },
                carType: {
                    label: '品牌车型',
                    required: false,
                    type: 'text',
                    readonly: true,
                    message: '车品牌车型不能为空',
                    state: ''
                },
                myCar: {
                    label: '品牌车型',
                    required: true,
                    type: 'text',
                    readonly: true,
                    message: '车品牌车型不能为空',
                    state: ''
                },
                displacement: {
                    label: '排量',
                    required: true,
                    type: 'text',
                    readonly: false,
                    message: '排量不能为空',
                    state: ''
                },
                engineNumber: {
                    label: '发动机号',
                    required: true,
                    type: 'text',
                    readonly: false,
                    message: '发动机号不符合规则',
                    rex: /^[0-9A-Za-z]{7,8}$/,
                    state: ''
                },
                innage: {
                    label: '剩余油量',
                    required: true,
                    type: 'text',
                    readonly: true,
                    message: '剩余油量不能为空',
                    state: ''
                },
                mileage: {
                    label: '行驶里程',
                    required: true,
                    type: 'number',
                    readonly: false,
                    message: '行驶里程不能为空',
                    state: ''
                },
                vin: {
                    label: 'vin码',
                    required: true,
                    type: 'text',
                    readonly: false,
                    message: 'vin码不符合规则',
                    rex: /^[0-9a-zA-Z]{17}$/,
                    state: ''
                },
                carColor: {
                    label: '车辆颜色',
                    required: true,
                    type: 'text',
                    readonly: true,
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
        }
    },
    computed: {
        ...mapGetters('work', ['WorkOrder', 'brandCodeData', 'CustomerInfo', 'CarInfo', 'isEdited']),
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
        ...mapMutations('work', ['SET_WORK_ORDER', 'CHANGE_EDIT_STATE']),
        ...mapActions('work', ['getBrandCode']),
        // handleChange(v) {
        //     console.log(this.appearanceValue);
        // },
        test(v) {
            console.log(v)
        },
        handleConfirm(date) {
            console.log(date)
            const _date = new window.Date(date)
            const time = `${_date.getFullYear()}年${_date.getMonth() + 1}月${_date.getDate()}日`
            this.seCarInfo.adviseMileageTime = time
        },
        handleSelected() {
            const that = this
            that.hidePopup()
            const info = that.seCarInfo
            let _tag = false
            const event = {
                myCar() {
                    info.myCar = `${info.brandCode} ${info.carTrainCode} ${info.carModelYear} ${info.carType}`
                    if (info.brandCode !== '') _tag = true
                    if (info.carTrainCode !== '') _tag = true
                    if (info.carModelYear !== '') _tag = true
                    if (info.carType !== '') _tag = true
                    // if (_tag) {
                    //     this.popFormRules.myCar.state = 'success';
                    // }
                }
                // appearance() {
                //     if (that.appearanceValue !== '') {
                //         console.log(that.appearances);
                //         const arr = R.map(R.prop('label'))(that.appearances);
                //         console.log(arr);
                //         info.appearance = (arr.indexOf(that.appearanceValue));
                //         console.log(info.appearance);
                //         console.log(that.appearanceValue);
                //         // _tag = true;
                //     }
                // }
                // carColor() {
                //     if (info.carColor !== '') _tag = true;
                // },
                // appearance () {
                //     if (info.appearance !== '') _tag = true;
                // }
            }
            if (event.hasOwnProperty(this.currentField)) {
                event[this.currentField]()
            } else if (info[this.currentField] !== '') {
                _tag = true
            }
            if (_tag) {
                this.popFormRules[this.currentField].state = 'success'
            }
        },
        hidePopup() {
            for (let k of Object.keys(this.PopupVisible)) {
                this.PopupVisible[k] = false
            }
        },
        rules(e) {
            // 验证
            const popFormRules = this.popFormRules
            this.seCarInfo[e] = this.seCarInfo[e].replace(/(^\s+)|(\s+$)/g, '')
            if (popFormRules[e].required) {
                if (this.seCarInfo[e] === '') {
                    popFormRules[e].state = 'error'
                    return
                } else if (popFormRules[e].rex) {
                    if (!popFormRules[e].rex.test(this.seCarInfo[e])) {
                        popFormRules[e].state = 'error'
                        return
                    }
                }
            }
            popFormRules[e].state = 'success'
        },
        event(v) {
            console.log(v)
            this.currentField = v
            if (v === 'myCar' || v === 'carColor' || v === 'appearance' || v === 'innage') {
                this.PopupVisible.btn = true
            }
            if (v === 'adviseMileageTime') {
                this.$refs.picker.open({
                    // startDate: new Date('2018-5-18')
                })
            }
            if (v === 'myCar') {
                this.PopupVisible.selectCar = true
                if (this.brandCodeData.selectCarindex.length === 0) {
                    this.getBrandCode()
                }
            } else if (this.PopupVisible.hasOwnProperty(`select${v}`)) {
                this.PopupVisible[`select${v}`] = true
            }
        },
        async handleNext() {
            console.log('提交')
            let form = {
                comprehensiveId: this.WorkOrder.comprehensiveId,
                orderType: this.WorkOrder.orderType,
                remark: this.remark,
                seCustomerInfo: this.CustomerInfo,
                seCarInfo: R.clone(this.seCarInfo)
            }
            form.seCarInfo.appearance = form.seCarInfo.appearance === '良好' ? 1 : 0
            const _innage = R.map(R.prop('value'))(this.innages)
            form.seCarInfo.innage = _innage.indexOf(form.seCarInfo.innage) + 1
            console.log(form)
            const { data } = await comprehensiveApi.save.r(form)
            console.log(data)
            let _obj = R.merge(data, { seCustomerInfo: form.seCustomerInfo, seCarInfo: form.seCarInfo })
            if (this.WorkOrder.seProjectList) {
                _obj = R.merge(_obj, { seProjectList: this.WorkOrder.seProjectList })
            }
            this.SET_WORK_ORDER(_obj)
            this.CHANGE_EDIT_STATE(true)
            this.$toast({
                message: `${this.WorkOrder.comprehensiveId !== '' ? '保存' : '开单'}成功!`,
                iconClass: 'icon icon-success',
                duration: 2000
            })
            console.log(this.WorkOrder.comprehensiveId)
            this.$router.push({
                name: 'work-services-item',
                query: {
                    id: this.WorkOrder.comprehensiveId
                }
            })
        },
        async handleSelectCarBrand(item) {
            // 通选择车品牌获取车系
            console.log(item)
            const { data } = await carApi.requestStyle.r({ brandId: item.id })
            this.seCarInfo.brandCode = item.brandName
            console.log(data)
            this.PopupVisible.selectCarTrain = true
            this.CarTrainData.CarTrainIndex = [...new Set(R.map(R.prop('factoryName'))(data))]
            for (let v of data) {
                if (this.CarTrainData.CarTrainObj[v.factoryName]) {
                    this.CarTrainData.CarTrainObj[v.factoryName].children.push(v)
                } else {
                    this.CarTrainData.CarTrainObj[v.factoryName] = {
                        children: [v]
                    }
                }
            }
        },
        async handleSelectCarTrain(item) {
            // 通过选择车系获取年款值
            console.log(item)
            const vm = this
            const { data } = await carApi.requestYear.r({ styleId: item.id })
            this.seCarInfo.carTrainCode = item.styleName
            this.CarTrainData.carTrainCode = item.id
            if (data.length) {
                vm.PopupVisible.selectCarYear = true
                vm.CarYeaIndex = data.map(v => {
                    v.value = v.year
                    v.label = v.year + '年'
                    return v
                })
            }
        },
        async handleSelectCarModelYear(year) {
            // 通过年款值获取该年款车型
            const vm = this
            // const styleId = vm.selectCatStyleCacheData.carTrainCode;
            // vm.selectCatStyleCacheData.carModelYear = year;
            const { data } = await carApi.requestModel.r({ styleId: this.CarTrainData.carTrainCode, year })
            console.log(data)
            if (data.length) {
                vm.PopupVisible.selectCarType = true
                vm.CarTypeIndex = data.map(v => {
                    v.value = v.modelName
                    v.label = v.modelName
                    return v
                })
            }
        },
        handleSelectCarType(type) {
            console.log(type)
        }
    },
    created() {
        if (this.CarInfo !== null && this.isEdited) {
            const _obj = R.merge(this.CarInfo, {
                myCar: `${this.CarInfo.brandCode}/${this.CarInfo.carTrainCode}/${this.CarInfo.carType}`,
                appearance: ['不正常', '良好'][this.CarInfo.appearance],
                innage: `${this.innages[this.CarInfo.innage - 1].label}`
            })
            this.seCarInfo = R.merge(this.seCarInfo, _obj)
        }
        if (this.isEdited) {
            this.remark = this.WorkOrder.remark
            for (let k of Object.keys(this.popFormRules)) {
                if (this.popFormRules[k].required) {
                    this.popFormRules[k].state = 'success'
                }
            }
        }
    }
}
</script>

<style lang="postcss">
.selectCarTypeBox {
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
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
    overflow-y: scroll;
    .mint-radiolist {
        padding-bottom: 50px;
    }
    .mint-indexlist-content {
        > li:last-child {
            margin-bottom: 50px;
        }
    }
}
.car-type .mint-cell-wrapper {
    font-size: 14px;
}
</style>
