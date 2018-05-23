<template>
    <div>
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left" @click.native="$router.push({name: 'work-item'})">返回</mt-button>
            <mt-button slot="right" @click.native="handleEdit">修改</mt-button>
        </mt-header>
        <div class="container-box scroll">
            <div class="selectCarTypeBox" style="z-index: 3000;" v-if="selectServicePopupVisible && selectServiceEdit && !selectServicePopupListVisible">
                <!-- <mt-button type="default" size="normal" @click="hidePopup">取消</mt-button> -->
                <mt-button type="primary" size="normal" @click="saveServiceParts">保存</mt-button>
            </div>
            <div class="page-part car-info">
                <mt-cell title="送修人信息" class="bold title"></mt-cell>
                <mt-field label="送修人：" v-model="form.seCustomerInfo.customerName" readonly disableClear></mt-field>
                <mt-field label="联系号码：" v-model="form.seCustomerInfo.tel" readonly disableClear></mt-field>
                <mt-field label="车牌号码：" v-model="form.seCustomerInfo.carNumber" readonly disableClear></mt-field>
                <mt-field label="住址：" v-model="form.seCustomerInfo.customerAddress" readonly disableClear></mt-field>
            </div>
            <div class="page-part car-info">
                <mt-cell title="车辆信息" class="bold title"></mt-cell>
                <mt-field label="品牌车型:" v-model="brandCode" readonly disableClear></mt-field>
                <mt-field label="排量：" v-model="form.seCarInfo.displacement" readonly disableClear></mt-field>
                <mt-field label="VIN码：" v-model="form.seCarInfo.vin" readonly disableClear></mt-field>
                <mt-field label="发动机号：" v-model="form.seCarInfo.engineNumber" readonly disableClear></mt-field>
                <mt-field label="行驶里程：" v-model="form.seCarInfo.mileage" readonly disableClear></mt-field>
                <mt-field label="车辆颜色：" v-model="form.seCarInfo.carColor" readonly disableClear></mt-field>
                <mt-field label="建议保养里程：" v-model="form.seCarInfo.adviseMileageMaintenance" readonly disableClear></mt-field>
                <mt-field label="建议保养时间：" v-model="form.seCarInfo.adviseMileageTime" readonly disableClear></mt-field>
                <mt-field label="剩余油量：" v-model="innage" readonly disableClear></mt-field>
                <mt-field label="车辆外观状况：" v-model="appearance" readonly disableClear></mt-field>
            </div>
            <div class="page-part">
                <mt-field label="备注：" v-model="remark" readonly disableClear></mt-field>
            </div>
            <div class="page-part service">
                <mt-cell :title="`服务项目信息 (总价：￥${allTotal})`" class="bold">
                    <mt-button type="primary" v-if="this.form.status < 5" size="small" @click.native="handleOpenSelectService(null)">添加</mt-button>
                </mt-cell>
                <div v-if="serviceData && serviceData.length !== 0">
                    <template v-for="(v, i) in serviceData">
                        <mt-cell-swipe :label="`备注：${v.description}`" :title="`${i + 1}. ${v.projectName}`" :right="[ // 服务项目左滑删除样式
                                {
                                    content: '取消',
                                    style: {
                                        background: '#ddd',
                                        color: '#fff'
                                    },
                                    handler: () => {
                                    }
                                },
                                {
                                    content: '修改',
                                    style: {
                                        background: '#26a2ff',
                                        color: '#fff'
                                    },
                                    handler() {
                                        handleOpenSelectService(i);
                                    }
                                },
                                {
                                    content: '删除',
                                    style: {
                                        background: 'red',
                                        color: '#fff'
                                    },
                                    handler() {
                                        deleteServiceProject(i, v);
                                    }
                                }
                            ]" :key="v.projectName + i + '-index'" @click.native="showServiceInfo(i)">
                            <template v-for="(k, j) in workState[sviceStateIndex[v.status - 1]]">
                                <mt-button type="primary" size="small" v-if="v.status && v.status !== 6" :key="k.name + j" :class="[j === 0 ? 'cell-btn' : '']" @click.native.stop="workStateMethods(i, k)">{{v.children.length > 0 && v.status === 1 && j === 0 ? '修改' : k.name}}</mt-button>
                                <span v-else :key="k.name + j">{{k.name}}</span>
                            </template>
                        </mt-cell-swipe>
                    </template>
                </div>
            </div>
            <mt-popup v-model="popupServiceVisible" popup-transition="popup-fade" class="mint-popup-select-list">
                <div class="select-list-wrap service" :class="[popupServiceVisible ? 'active' : '']">
                    <mt-radio title="选择服务项目：" v-model="serviceValue.title" :options="selectServiceindex" @change="handleSelectService">
                    </mt-radio>
                    <mt-field label="描述：" v-model="serviceValue.description" placeholder="请输入描述信息">
                        <mt-button v-if="serviceValue.description !== '' && serviceValue.title !== ''" type="primary" size="small" class="checked" @click.native="saveServiceProject">确定</mt-button>
                    </mt-field>
                </div>
            </mt-popup>
            <mt-popup :modal="false" v-model="selectServicePopupVisible" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
                <mt-header fixed title="选择配件">
                    <mt-button v-if="selectServiceEdit" icon="back" slot="left" @click.native="selectServicePopupVisible = false">返回</mt-button>
                    <!-- <mt-button v-if="selectServiceEdit" slot="right" @click.native="saveServiceParts">保存</mt-button> -->
                    <mt-button v-if="!selectServiceEdit" slot="right" @click.native="selectServicePopupVisible = false">关闭</mt-button>
                </mt-header>
                <div class="container-box scroll">
                    <div class="page-part info">
                        <mt-cell title="车辆信息" class="bold"></mt-cell>
                        <mt-field label="车牌号：" v-model="form.seCustomerInfo.carNumber" readonly disableClear></mt-field>
                        <mt-field label="车型：" v-model="brandCode" readonly disableClear></mt-field>
                        <mt-field label="排量：" v-model="form.seCarInfo.displacement" readonly disableClear></mt-field>
                        <mt-field label="VIN码：" v-model="form.seCarInfo.vin" readonly disableClear></mt-field>
                        <mt-field label="发动机号：" v-model="form.seCarInfo.engineNumber" readonly disableClear></mt-field>
                    </div>
                    <div class="page-part" style="padding-bottom:">
                        <mt-cell v-if="selectServicePopupVisible && serviceData && serviceData.length !== 0" class="bold" :label="`备注：${serviceData[serviceActive].description}`" :title="`${serviceData[serviceActive].projectName}(￥${total})`">
                            <mt-button v-if="selectServiceEdit" size="small" type="primary" icon="" class="cell-btn" @click.native="getFittingindex">添加物料</mt-button>
                            <mt-button v-if="selectServiceEdit" size="small" type="primary" icon="" class="cell-btn" @click.native="handleAddmanHour">添加工时</mt-button>
                        </mt-cell>
                        <template v-for="(v, i) in currentParts">
                            <div class="accessories-title bold" :key="v.name + i">{{v.name}}：</div>
                            <div v-if="v.children.length !== 0" :key="v.name + i + 'box'">
                                <template v-for="(k, j) in v.children">
                                    <mt-cell-swipe :key="'swipe' + j + i" v-if="selectServiceEdit" class="accessories-item" :right="[ // 配件左滑删除样式
                                        {
                                            content: '修改',
                                            style: {
                                                background: '#26a2ff',
                                                color: '#fff'
                                            },
                                            handler() {
                                                editParts({
                                                    pIndex: i,
                                                    cIndex: j,
                                                    part: k
                                                });
                                            }
                                        },
                                        {
                                            content: '删除',
                                            style: {
                                                background: 'red',
                                                color: '#fff'
                                            },
                                            handler() {
                                                deleteParts(j, k);
                                            }
                                        }
                                    ]" :title=" i=== 2 ? `${j + 1}.${k.materialName}` : `${j + 1}.${k.materialName} `" :label=" i !== 2 ? `编码：${k.code}` : ''">
                                        <button class="my-input-button" @click.stop="handleChangeNumber(i, j, -1)">－</button>{{k.number}}
                                        <button class="my-input-button" @click.stop="handleChangeNumber(i, j, 1)">＋</button>
                                    </mt-cell-swipe>
                                    <mt-cell :key="'swipe' + j + i" v-else :title=" i=== 2 ? `${j + 1}.${k.materialName}` : `${j + 1}.${k.materialName} `" :label=" i !== 2 ? `编码：${k.code}` : ''">{{ i !== 2 ? `数量：${k.number}` : ''}}</mt-cell>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </mt-popup>
            <mt-popup :modal="false" v-model="selectServicePopupListVisible" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
                <mt-header fixed title="选择配件">
                    <mt-button icon="back" slot="left" @click.native="selectServicePopupListVisible = false">返回</mt-button>
                </mt-header>
                <div class="parts-list container-box">
                    <div class="page-part">
                        <mt-navbar v-model="selected">
                            <template v-for="(v, i) in ['配件', '材料', '设备']">
                                <mt-tab-item :id="`${i}`" :key="v + i + 'material'" @click.native="getFittingindex">{{v}}</mt-tab-item>
                            </template>
                        </mt-navbar>
                    </div>
                    <mt-tab-container v-model="selected">
                        <template v-for="(n, j) in 3">
                            <mt-tab-container-item :id="`${j}`" :key="'index' + j + 'part'">
                                <template v-for="(v, i) in fittingsData[selected]">
                                    <mt-cell :title="`${i + 1}.${v.materialName}`" :label="`库存：${v.num} `" :key="v.materialName + i + 'part'">
                                        <mt-button size="small" type="primary" icon="" class="cell-btn" @click.native="openSelectNum(v)">添加</mt-button>
                                    </mt-cell>
                                </template>
                            </mt-tab-container-item>
                        </template>
                    </mt-tab-container>
                </div>
            </mt-popup>
            <mt-popup v-model="pickerVisible" position="bottom" class="pickerVisible">
                <mt-cell :title="`金额：${selectNum.replace(/[^0-9\.]/ig, '')}`">
                    <button class="my-input-button" @click.stop="changeNumber(-1)">－</button>{{number}}
                    <button class="my-input-button" @click.stop="changeNumber(1)">＋</button>
                    <mt-button size="small" type="primary" icon="" class="cell-btn" @click.native="submitAddParts">确定</mt-button>
                </mt-cell>
                <mt-picker :slots="numberSlots" @change="onPriceChange" :visible-item-count="3" :show-toolbar="false"></mt-picker>
            </mt-popup>
        </div>
    </div>
</template>

<script>
import { dictionaryApi, comprehensiveApi, fittingApi } from '@/api'
import { mapGetters, mapMutations } from 'vuex'
import { catchError } from '@/util'
import * as R from 'ramda'
export default {
    data() {
        return {
            remark: '',
            title: '',
            selected: '0',
            popupServiceVisible: false, // 服务项目
            selectServicePopupVisible: false, // 服务项目信息报价
            selectServiceEdit: true,
            selectServicePopupListVisible: false, // 配件列表
            pickerVisible: false, // 配件计数器
            editPartsPrice: false, // 是否在修改价格
            selectCarindex: [], // 车品牌列表
            selectCarObj: {}, // 排序后车品牌列表
            selectCarListindex: [], // 车系分类
            selectCarListObj: {}, // 车系分类子项目列表
            serviceValue: {
                // 服务项目选择状态
                title: '',
                serviceIndex: 0,
                description: ''
            },
            selectCarYearindex: [], // 车年款
            selectServiceindex: [
                // 服务项目列表
            ],
            // selectCarYearObj: {},
            selectCarStyle: [], // 车款式
            yearValue: '', // 车年款值
            searchValue: '', // 搜索
            innageData: [
                { value: '1', label: '空' },
                { value: '2', label: '1/4' },
                { value: '3', label: '1/2' },
                { value: '4', label: '3/4' },
                { value: '5', label: '满' }
            ],
            serviceData: [],
            serviceActive: 0, // 当前操作服务项目索引
            parts: [], // 当前操作服务项目配件列表
            selectCatStyleData: {
                // 选择车型状态
                // 选择品牌车型
                brand: '',
                brandCode: '',
                carTrain: '',
                carTrainCode: '',
                carType: '',
                carModelYear: ''
            },
            form: {
                // 综合服务单
                // serviceType: [],
                // comprehensiveCd: '', //
                // comprehensiveId: 0, //
                // customerRequest: '', //
                // dispatchReport: 'xxxx', //
                // errorDescription: '', // 故障描述
                // inspectorId: 1, //
                // maintenanceSuggestion: '', // 维修建议
                orderType: 1, // 单据类型 1.综合服务单 2 工时快速单 ,
                remark: '', // 备注
                reservationId: 0, // 预约单ID
                seCarInfo: {
                    // 车辆信息
                    adviseMileageMaintenance: '', // 建议保养里程
                    adviseMileageTime: '', // 建议保养时间
                    appearance: 1, // 车身外观 1 良好 0不正常
                    brandCode: '', // 品牌编码
                    carTrainCode: '', // 车系
                    carModelYear: '', // 车型年款
                    carType: '', // 车型
                    displacement: '', // 排量
                    // buyTime: '2016-05-20 15:50:10',
                    engineNumber: '', // 发动机号
                    innage: 1, // 剩余油量
                    // insuranceCompany: '', // 投保公司
                    // insuranceEndTime: '2017-06-20 18:00:00', //
                    mileage: '', // 行驶里程
                    // verificationEndTime: '2017-06-20 18:00:00', //
                    vin: '', // VIN
                    carColor: '' // 车辆颜色
                },
                // seCarReport: {
                //   dataJson: 'string', //
                //   inspectAdvise: 'string', //
                //   inspectType: 1 //
                // },
                seCustomerInfo: {
                    // 送修人信息
                    carNumber: '', // 车牌号码：
                    customerAddress: '', // 顾客地址
                    // customerFrom: 1, //
                    customerName: '', // 送修人
                    // dispatchReport: '出车报告', //
                    // endTime: '2017-06-20 19:20:20', //
                    // planEndTime: '2017-06-30 19:20:20', //
                    // remark: '备注', //
                    // sendPeople: '', // 送修人
                    // sendPeopleTel: '', // 送修人电话
                    // serviceAdvisor: 1, // 服务顾问
                    // serviceProperty: 1, // 服务性质
                    // serviceType: [], // 需求信息
                    startTime: '', // 开始时间
                    tel: '' // 手机号码
                    // tipCarOwner: 0, //
                    // workDepartment: 'xxxxx' //
                },
                // seExtraProjectList: [
                //   {
                //     discount: 50, //
                //     extraProjectCd: 0, //
                //     extraProjectName: 'test', //
                //     number: 5, //
                //     price: 10, //
                //     remark: '备注', //
                //     totalAccount: 50 //
                //   }
                // ],
                seProjectList: []
                // totalAccessoryFee: 120.5, //
                // totalExtraFee: 120.5, //
                // totalFee: 220.5, //
                // totalHourFee: 100.5 //
            },
            sviceStateIndex: ['toQuote', 'approve', 'construction', 'constructionIng', 'testing', 'finish'], // 项目状态索引
            workState: {
                toQuote: [
                    {
                        name: '报价',
                        value: 'toQuote',
                        state: 1
                    },
                    {
                        name: '提交',
                        value: 'approve',
                        state: 2
                    }
                ],
                approve: [
                    {
                        name: '修改',
                        value: 'toQuote',
                        state: 1
                    },
                    {
                        name: '下派',
                        value: 'construction',
                        state: 3
                    }
                ],
                construction: [
                    {
                        name: '撤回',
                        value: 'approve',
                        state: 2
                    },
                    {
                        name: '施工',
                        value: 'constructionIng',
                        state: 4
                    }
                ],
                constructionIng: [
                    {
                        name: '停工',
                        value: 'approve',
                        state: 2
                    },
                    {
                        name: '质检',
                        value: 'testing',
                        state: 5
                    }
                ],
                testing: [
                    {
                        name: '返工',
                        value: 'construction',
                        state: 4
                    },
                    {
                        name: '完成',
                        value: 'finish',
                        state: 6
                    }
                ],
                finish: [
                    {
                        name: '完工'
                    }
                ]
            },
            fittingsData: [
                // 配件列表
                [], // 配件
                [], // 材料
                [] // 设备
            ],
            numberSlots: [
                // 配件数量选择器样式
                {
                    flex: 1,
                    defaultIndex: 0,
                    values: [...new Array(10).keys()].map(v => `${v + 1}`),
                    textAlign: 'center'
                }
            ],
            price: '',
            selectNum: '', // 配件数量
            number: 1,
            picker: null, // 配件数量选择器
            serviceProjectId: 0, // 当前操作服务项目ID
            selectedPart: null,
            currentService: null,
            brandCode: '',
            appearance: '',
            innage: ''
        }
    },
    computed: {
        ...mapGetters('work', ['WorkOrder', 'isEdited']),
        allTotal() {
            // 服务单总金额
            let _total = 0
            if (this.form.seProjectList) {
                for (let v of Object.values(this.form.seProjectList)) {
                    for (let j of Object.values(v.children)) {
                        console.log(j)
                        _total += (j.price - 0) * j.number
                    }
                }
            }
            return _total
        },
        currentParts() {
            const arr = [
                {
                    name: '配件',
                    children: []
                },
                {
                    name: '材料',
                    children: []
                },
                {
                    name: '工时',
                    children: []
                },
                {
                    name: '设备',
                    children: []
                },
                {
                    name: '其他',
                    children: []
                }
            ]
            this.parts.map((v, i) => {
                v.index = i
                if (v.classifyId === 1) {
                    arr[0].children.push(v)
                } else if (v.classifyId === 2) {
                    arr[1].children.push(v)
                } else if (v.classifyId === 3) {
                    arr[3].children.push(v)
                } else if (v.classifyId === 0) {
                    arr[2].children.push(v)
                } else {
                    arr[4].children.push(v)
                }
            })
            return arr
        },
        total() {
            // 单个项目总金额
            let _total = 0
            for (let v of Object.values(this.parts)) {
                console.log(v.price)
                _total += (v.price - 0) * v.number
            }
            return _total
        }
    },
    methods: {
        ...mapMutations('work', ['SET_WORK_ORDER', 'CHANGE_EDIT_STATE']),
        async editParts(part) {
            console.log(part)
            try {
                const { data } = await fittingApi.getPrice.r({
                    fittingId: part.part.materialId
                })
                console.log(data)
                // const values = data.map(v => `${v.priceName}: ￥${v.price}`);
                // this.editPartsPrice = true;
                this.openSelectNum(part, data)
            } catch (err) {
                console.error(err)
            }
        },
        changeNumber(num) {
            this.number += num
            if (this.number === 0) {
                this.number = 1
            }
        },
        showServiceInfo(i) {
            // 单个项目信息
            console.log(i)
            const project = this.serviceData[i]
            this.selectServicePopupVisible = true
            this.selectServiceEdit = false
            this.serviceActive = i
            this.parts = R.clone(project.children)
        },
        handleEdit() {
            // 修改服务单信息
            this.CHANGE_EDIT_STATE(true)
            this.$router.push({
                name: 'EditCustomerInfo-item',
                query: {
                    id: this.$route.query.id
                }
            })
        },
        async getServiceType() {
            // 获取服务项目列表
            try {
                const { data } = await dictionaryApi.request.r({
                    code: 'TYPE_SERVICE'
                })
                console.log('服务项目', data)
                this.selectServiceindex = data.TYPE_SERVICE.map(v => {
                    return {
                        label: v.dicName,
                        value: v.dicName
                    }
                })
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async handleAddmanHour() {
            const that = this
            try {
                const result = await that.$prompt(' ', '请输入工时费')
                console.log(result)
                if (result.action === 'confirm') {
                    const part = {
                        barCode: '',
                        feeType: 1,
                        classifyId: 0,
                        code: '',
                        materialId: '',
                        materialName: `￥${result.value}`,
                        number: 1,
                        price: result.value,
                        serviceProjectId: that.currentService.serviceProjectId
                    }
                    this.parts.push(part)
                }
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async saveServiceParts() {
            // 保存服务项目报价
            const that = this
            try {
                const result = await this.$message({
                    title: '提示',
                    message: '确定保存服务项目信息？',
                    showCancelButton: true
                })
                if (result === 'confirm') {
                    that.currentService.children = this.parts
                    console.log(JSON.stringify(that.currentService))
                    const res = await comprehensiveApi.seproject.r([that.currentService])
                    console.log(res)
                    this.$toast({
                        message: `保存成功!`,
                        iconClass: 'icon icon-success',
                        duration: 2000
                    })
                    this.selectServicePopupVisible = false
                }
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        handleOpenSelectService(i) {
            // 打开可选服务项目列表
            this.popupServiceVisible = true
            this.serviceValue.serviceIndex = i
            this.serviceValue.title = i !== null ? this.serviceData[i].projectName : ''
            this.serviceValue.description = i !== null ? this.serviceData[i].description : ''
            console.log(this.serviceValue.title)
        },
        async saveServiceProject() {
            // 保存选择服务项目
            const index = this.serviceValue.serviceIndex
            const title = this.serviceValue.title
            const description = this.serviceValue.description
            if (index !== null) {
                this.serviceData[index].projectName = title
                this.serviceData[index].description = description
            } else {
                if (this.serviceData === null) {
                    this.serviceData = []
                }
                this.serviceData.push({
                    children: [],
                    comprehensiveId: this.form.comprehensiveId,
                    constructorId: '',
                    constructorName: '',
                    description,
                    projectName: title,
                    projectType: 0,
                    status: 1
                })
            }
            try {
                const { data } = await comprehensiveApi.seproject.r(this.serviceData)
                this.popupServiceVisible = false
                console.log('保存服务项目后', this.serviceData)
                // this.serviceData = res;
                const last = R.last(this.serviceData)
                last.serviceProjectId = R.last(data).serviceProjectId
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        handleSelectService(v) {
            // 确定选择服务项目
            console.log(v)
            this.serviceValue.title = v
        },
        async handleQuery(id) {
            // 查询服务单详情
            try {
                const { data } = await comprehensiveApi.request.r({
                    accountSquared: '',
                    operatorId: '',
                    serviceType: '',
                    comprehensiveId: id,
                    fromDate: '',
                    endDate: '',
                    orderType: 0,
                    orderStyle: 0,
                    // status: 1,
                    param: '',
                    page: 1,
                    pageSize: 9999
                })
                console.log(data[0])
                this.SET_WORK_ORDER(data[0])
                this.form = this.WorkOrder
                this.remark = this.form.remark
                this.brandCode = `${this.form.seCarInfo.brandCode}/${this.form.seCarInfo.carTrainCode}/${
                    this.form.seCarInfo.carType
                }`
                this.appearance = ['不正常', '良好'][this.form.seCarInfo.appearance]
                this.innage = `${this.innageData[this.form.seCarInfo.innage - 1].label}`
                this.serviceData = this.form.seProjectList || []
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async workStateMethods(i, status) {
            // 操作服务项目
            console.log('status', status)
            const that = this
            const project = that.serviceData[i]
            console.log('project', project)
            that.currentService = project
            const fns = {
                toQuote() {
                    that.selectServicePopupVisible = true
                    that.selectServiceEdit = true
                    that.serviceActive = i
                    that.parts = R.clone(project.children)
                },
                approve() {
                    console.log('提交')
                },
                construction() {
                    console.log('下派')
                },
                constructionIng() {
                    console.log('开始施工')
                },
                testing() {
                    console.log('质检')
                },
                finish() {
                    console.log('完成')
                }
            }
            fns[status.value]()
            try {
                if (status.state !== 1) {
                    const { data } = await comprehensiveApi.seprojectUpdateStatus.r({
                        serviceProjectId: project.serviceProjectId,
                        status: status.state
                    })
                    console.log('pojsjsjs', data)
                    project.status = data.status
                }
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async getFittingindex() {
            // 获取物料列表
            const that = this
            that.selectServicePopupListVisible = true
            if (that.fittingsData[that.selected].length === 0) {
                const arr = R.clone(that.fittingsData)
                try {
                    const { data } = await fittingApi.inventoryFitting.r({
                        // inventoryFlag: true,
                        // fittingId: 34,
                        classifyId: that.selected - 0 + 1,
                        // param: '',
                        page: 1,
                        pageSize: 99999
                    })
                    console.log('配件列表', data)
                    arr[that.selected] = data
                    that.fittingsData = arr
                    console.log(that.fittingsData)
                } catch (err) {
                    console.error(err)
                    catchError(err)
                }
            }
        },
        openSelectNum(part, values) {
            // 配件数量选择
            console.log('配件', part)
            this.selectedPart = part
            const _values = values || part.prices
            console.log(_values)
            this.numberSlots[0].values = _values.map(v => `${v.priceName}: ￥${v.price}`)
            let selectIndex = 0
            this.editPartsPrice = values ? 1 : 0
            this.number = 1
            if (values) {
                const prices = R.map(R.prop('price'))(_values)
                const _part = part.part
                selectIndex = prices.indexOf(_part.price)
                this.number = _part.number
            }
            console.log(selectIndex)
            this.pickerVisible = true
            if (this.pciker !== null) {
                this.picker.setSlotValue(0, '1')
            }
            this.numberSlots[0].defaultIndex = selectIndex
            this.price = '1'
        },
        onPriceChange(picker, values) {
            console.log(values)
            // 修改配件价格
            this.price = values[0]
            if (this.picker === null) {
                this.picker = picker
            }
        },
        handleChangeNumber(i, j, num) {
            // this.parts[i].number += num;
            console.log(this.currentParts)
            const arr = this.currentParts
            arr[i].children[j].number += num
            if (arr[i].children[j].number === 0) {
                arr[i].children[j].number = 1
            }
        },
        submitAddParts() {
            // 确定添加配件
            console.log(this.selectedPart)
            console.log('金额', this.selectNum)
            if (this.editPartsPrice) {
                console.log(this.selectedPart.part)
                console.log(this.parts)
                const ids = R.map(R.prop('id'))(this.parts)
                const index = ids.indexOf(this.selectedPart.part.id)
                this.parts[index].number = this.number
                this.parts[index].price = this.price.replace(/[^0-9.]/gi, '') - 0
            } else {
                const part = {
                    barCode: '',
                    feeType: 2,
                    classifyId: this.selectedPart.classifyId,
                    code: this.selectedPart.code,
                    materialId: this.selectedPart.id,
                    materialName: this.selectedPart.materialName,
                    number: this.number,
                    price: this.price.replace(/[^0-9.]/gi, '') - 0,
                    serviceProjectId: this.currentService.serviceProjectId
                }
                this.parts.push(part)
            }
            this.pickerVisible = false
        },
        async deleteServiceProject(i, v) {
            const that = this
            const status = that.serviceData[i].status
            try {
                const result = await that.$message({
                    title: '提示',
                    message: '是否删除该项目？',
                    showCancelButton: true
                })
                if (result === 'confirm') {
                    if (status <= 3) {
                        console.log(that.serviceData)
                        console.log(that.serviceData)
                        const res = await comprehensiveApi.deleteProject.r({
                            params: '',
                            serviceProjectId: that.serviceData[i].serviceProjectId
                        })
                        console.log(res)
                        if (res.status === 200) {
                        }
                        that.serviceData = [...R.remove(i, 1, that.serviceData)]
                        that.$toast({
                            message: `已删除`,
                            iconClass: 'icon icon-success',
                            duration: 2000
                        })
                    } else {
                        that.$toast({
                            message: `该项目已${status !== 6 ? '施工' : '完工'}，无法删除。`,
                            iconClass: 'icon icon-success',
                            duration: 2000
                        })
                    }
                }
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        async deleteParts(i, v) {
            console.log(i)
            console.log(v)
            this.parts = [...R.remove(v.index, 1, this.parts)]
        }
    },
    watch: {
        // selectCarPopupVisible(v) {
        //     console.log(v);
        //     if (v) this.$refs.list.$el.querySelector('.mint-indexlist-content').style.height = null;
        // }
    },
    created() {
        this.getServiceType()
        // const id = this.$route.query.id;
        // if (id) {
        if (this.isEdited) {
            console.log('A')
            this.form = this.WorkOrder
            this.remark = this.form.remark
            this.brandCode = `${this.form.seCarInfo.brandCode}/${this.form.seCarInfo.carTrainCode}/${
                this.form.seCarInfo.carType
            }`
            this.appearance = ['不正常', '良好'][this.form.seCarInfo.appearance]
            this.innage = `${this.innageData[this.form.seCarInfo.innage - 1].label}`
            if (this.form.seProjectList === null) {
                this.form.seProjectList = []
            }
            this.serviceData = this.form.seProjectList
        } else {
            this.handleQuery(this.$route.query.id)
            console.log('B')
        }
        this.title = this.$route.meta.name
        // }
    },
    mounted() {}
}
</script>

<style lang="postcss">
.page-part {
    padding-bottom: 15px;
    &.car-info {
        .mint-cell {
            min-height: 20px;
        }
    }
    &.service {
        .mint-field {
            .mint-cell-title {
                width: 50px;
            }
        }
    }
    &.info {
        .mint-cell {
            min-height: 20px;
            &:last-child {
                background: #fff;
            }
        }
        .mint-field {
            .mint-cell-title {
                width: auto;
                // text-align: right;
                span {
                    display: inline-block;
                }
            }
            &:nth-child(3) {
            }
            &:nth-child(4) {
                .mint-cell-title {
                    width: 50px;
                }
            }
            &:nth-child(2),
            &:nth-child(5) {
                .mint-cell-title {
                    width: 70px;
                }
            }
            &:nth-child(6) {
                .mint-cell-title {
                    width: 80px;
                }
            }
        }
    }
    .accessories-title {
        padding: 10px 10px;
        background: #eee;
        font-size: 14px;
        color: #000;
    }
    .accessories-item {
        .mint-cell-title,
        .mint-cell-value {
            font-size: 14px;
            color: #999;
        }
    }
}
.mint-popup .mint-cell {
    &.active {
        border: 1px solid #000;
    }
    .mint-cell-wrapper {
        background: none;
    }
}
.cell-btn {
    margin-right: 10px;
}
.mint-indexsection-index {
    background: #eee;
}
.mint-popup-select-car {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.mint-radiolist-title {
    font-size: 16px;
    padding-left: 10px;
    margin: 5px 0;
    line-height: 1.5;
}
.car-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 52px;
    bottom: 0;
    height: auto;
    overflow: scroll;
    z-index: 5;
    .mint-indexsection:last-child {
        margin-bottom: 50px;
    }
    .mint-cell-allow-right:after {
        border: none;
    }
    .mint-indexlist-content {
        position: absolute;
        // padding-top: 52px;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    }
}
.mint-popup-select-list {
    width: 100%;
    height: 100%;
    // transform: translate3d(-12%, -50%, 0);
    background: none;
}
.select-list-wrap {
    // position: fixed;
    // width: 100%;
    // height: auto;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // background: #fff;
    // transition: all 0.3s;
    // overflow: scroll;
    // transform: translate3d(100%, 0, 0);
    .checked {
        margin-left: 100px;
    }
    .mint-indexsection:last-child {
        margin-bottom: 50px;
    }
    &.active {
        transform: translate3d(0, 0, 0);
    }
    &.checked {
        transform: translate3d(-38%, 0, 0);
    }
    &.service .mint-cell {
        min-height: 35px;
    }
}
.popup-model {
    width: 100%;
    height: 50%;
    padding: 20px 0 50px;
    overflow: scroll;
    .mint-cell-allow-right:after {
        border: none;
    }
}
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
.mint-popup-select-color {
    width: 100%;
}
.parts-list {
    padding-top: 40px;
    .mint-tab-container {
        position: fixed;
        width: 100%;
        left: 0;
        top: 101px;
        bottom: 0;
        overflow-y: scroll;
        background: #fff;
    }
}
.pickerVisible {
    width: 100%;
    .picker-slot-wrapper,
    .picker-item {
        backface-visibility: hidden;
    }
    p {
        padding: 5px 10px;
    }
}
.addPart {
    position: fixed;
    bottom: 15px;
    right: 15px;
}

.my-range .mint-cell-value {
    flex: 2.5;
    position: relative;
    .mt-range {
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
}
</style>
