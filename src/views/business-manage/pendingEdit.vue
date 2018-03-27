<template>
    <div class="container-box">
        <div class="selectCarTypeBox" v-if="selectCarPopupVisible" style="z-index: 3000;">
            <mt-button type="default" size="normal" @click="selectCarPopupVisible = false">取消</mt-button>
            <mt-button type="primary" size="normal" @click="checkedCarType">确定</mt-button>
        </div>
        <div class="page-part">
            <mt-cell title="送修人信息"></mt-cell>
            <mt-field label="送修人：" v-model="form.seCustomerInfo.customerName" placeholder="请输入送修人名称"></mt-field>
            <mt-field label="联系号码：" v-model="form.seCustomerInfo.tel" placeholder="请输入联系手机号码" type="tel"></mt-field>
            <mt-field label="车牌号码：" v-model="form.seCustomerInfo.carNumber" placeholder="请输入车牌号码"></mt-field>
            <mt-field label="住址：" v-model="form.seCustomerInfo.customerAddress" placeholder="请输入住址"></mt-field>
        </div>
        <div class="page-part">
            <mt-cell title="车辆信息"></mt-cell>
            <mt-cell title="品牌车型" :label="selectCatStyleData.carType" is-link :value="selectCatStyleData.carTrain === '' ? '选择车型' : selectCatStyleData.carTrain" @click.native="handleSelectBrandCode"></mt-cell>
            <mt-field label="排量：" v-model="form.seCarInfo.displacement" placeholder="请输入排量"></mt-field>
            <mt-field label="VIN码：" v-model="form.seCarInfo.vin" placeholder="请输入VIN码" type="tel"></mt-field>
            <mt-field label="发动机号：" v-model="form.seCarInfo.engineNumber" placeholder="请输入发动机号"></mt-field>
            <mt-field label="行驶里程：" v-model="form.seCarInfo.mileage" placeholder="请输入行驶里程"></mt-field>
            <mt-cell title="车辆颜色：" is-link :value="cacheData.carColor" @click.native="popupColorVisible = true"></mt-cell>
            <mt-field label="建议保养里程：" v-model="form.seCarInfo.adviseMileageMaintenance" placeholder="请输入建议保养里程"></mt-field>
            <mt-field label="建议保养时间：" v-model="form.seCarInfo.adviseMileageTime" placeholder="请输入建议保养时间"></mt-field>
            <mt-field label="剩余油量：" v-model="form.seCarInfo.innage" placeholder="请输入剩余油量"></mt-field>
            <mt-cell title="车辆外观状况：" is-link :value="cacheData.appearance" @click.native="sheetVisible = true"></mt-cell>
        </div>
        <div class="page-part service">
            <mt-cell title="需求信息"></mt-cell>
            <template v-for="(v, i) in serviceData">
                <mt-cell-swipe :title="v.title !== '' ? `${i + 1}. ${v.title}` : ''"
                    is-link
                    :right="[ // 服务项目左滑删除样式
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
                            content: '删除',
                            style: {
                                background: 'red',
                                color: '#fff'
                            },
                            handler() {
                                deleteServiceProject(i);
                            }
                        }
                    ]"
                    :key="v.title + i + '-index'" @click.native="handleOpenSelectService(i)">
                    {{v.name}}
                </mt-cell-swipe>
                <mt-field v-if="v.title !== ''" v-model="v.description" label="描述：" placeholder="服务描述" :key="i + 'index'"></mt-field>
            </template>
            <mt-field label="备注：" v-model="form.remark" placeholder=""></mt-field>
            <!-- <mt-cell is-link>备注</mt-cell> -->
        </div>
        <div class="page-part">
            <mt-cell title="服务报价信息"></mt-cell>
            <template v-for="(v, i) in serviceData">
                <mt-cell v-if="v.title !== ''" :title="v.title" :label="`描述：(${v.description})`" :key="i + 'index'">
                    <template v-for="(k, j) in workState[sviceStateIndex[v.status - 1]]">
                        <mt-button type="primary" size="small" v-if="v.status && v.status !== 6" :key="k.name + j" :class="[j === 0 ? 'cell-btn' : '']" @click.native="workStateMethods(i, k)">{{v.children.length > 0 && v.status === 1 && j === 0 ? '修改' : k.name}}</mt-button>
                        <span v-else :key="k.name + j">{{k.name}}</span>
                    </template>
                    <!-- <mt-button type="primary" size="small" class="cell-btn" @click.native="selectServicePopupVisible = true">报价</mt-button>
                    <mt-button type="primary" size="small">审批</mt-button> -->
                </mt-cell>
            </template>
        </div>
        <div class="page-part">
            <mt-button type="primary" size="large" @click.native="saveSubmit">{{btnText}}</mt-button>
            <!-- <br>
            <mt-button type="primary" size="large" @click.native="handleSubmit">{{btnText}}</mt-button> -->
        </div>
        <mt-popup :modal="false" v-model="selectCarPopupVisible" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
            <mt-search v-model="searchValue" :show="showSelectCarList" cancel-text="取消" placeholder="搜索">
                <mt-index-list class="car-list" ref="list">
                    <template v-for="(v, i) in selectCarindex">
                        <mt-index-section v-if="selectCarindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarObj[v].children">
                                <mt-cell :title="j.brandName" :class="[selectCatStyleCacheData.brand === j.brandName ? 'active' : '']" :key="k" is-link @click.native="handleSelectCarBrand(j.id, j.brandName)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list>
            </mt-search>
        </mt-popup>
        <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="mint-popup-select-list">
            <div class="select-list-wrap" :class="[popupVisible ? 'active' : '', popupYearVisible ? 'checked' : '']">
                <p style="margin: 5px 0; color: #ccc;padding-left: 10px;">选择车系：</p>
                <mt-index-list>
                    <template v-for="(v, i) in selectCarListindex">
                        <mt-index-section v-if="selectCarListindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarListObj[v].children">
                                <mt-cell :title="j.styleName" :class="[selectCatStyleCacheData.carTrain === j.styleName ? 'active' : '']" :key="k" is-link @click.native="handleSelectCarTrain(j.id, j.styleName)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list>
            </div>
        </mt-popup>
        <mt-popup v-model="popupYearVisible" popup-transition="popup-fade" class="mint-popup-select-list">
            <div class="select-list-wrap" :class="[popupYearVisible ? 'active' : '']">
                <mt-radio title="选择年份：" v-model="yearValue" :options="selectCarYearindex" @change="handleSelectCarModelYear">
                </mt-radio>
                <!-- <mt-index-list>
                    <template v-for="(v, i) in selectCarYearindex">
                        <mt-index-section v-if="selectCarYearindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarYearObj[v].children">
                                <mt-cell :title="j.year" :key="k" is-link @click.native="handleSelectCarList(j.id)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list> -->
            </div>
        </mt-popup>
        <mt-popup v-model="popupServiceVisible" popup-transition="popup-fade" class="mint-popup-select-list">
            <div class="select-list-wrap" :class="[popupServiceVisible ? 'active' : '']">
                <mt-radio title="选择服务项目：" v-model="serviceValue.title" :options="selectServiceindex" @change="handleSelectService">
                </mt-radio>
                <!-- <mt-button type="primary" size="large">确定</mt-button> -->
                <!-- <mt-index-list>
                    <template v-for="(v, i) in selectCarYearindex">
                        <mt-index-section v-if="selectCarYearindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarYearObj[v].children">
                                <mt-cell :title="j.year" :key="k" is-link @click.native="handleSelectCarList(j.id)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list> -->
            </div>
        </mt-popup>
        <mt-popup v-model="popupModelVisible" position="bottom" popup-transition="popup-fade" class="popup-model">
            <p style="margin: 5px 0; color: #ccc;padding-left: 10px;">选择款式：</p>
            <template v-for="(v, i) in selectCarStyle">
                <mt-cell :title="`${1 + i}. ` + v.modelName" :class="[selectCatStyleCacheData.carType === v.modelName ? 'active' : '']" :key="i" is-link @click.native="handleSelectCarType(v.modelName)">
                </mt-cell>
            </template>
        </mt-popup>
        <mt-popup v-model="popupColorVisible" popup-transition="popup-fade" class="mint-popup-select-list">
            <div class="select-list-wrap" :class="[popupColorVisible ? 'active' : '']">
                <mt-radio title="选择车辆颜色：" v-model="cacheData.carColor" :options="carColors" @change="handleSelectCarColor">
                </mt-radio>
                <!-- <mt-index-list>
                    <template v-for="(v, i) in selectCarYearindex">
                        <mt-index-section v-if="selectCarYearindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarYearObj[v].children">
                                <mt-cell :title="j.year" :key="k" is-link @click.native="handleSelectCarList(j.id)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list> -->
            </div>
        </mt-popup>
        <mt-actionsheet :actions="actions" v-model="sheetVisible">
        </mt-actionsheet>
        <mt-popup :modal="false" v-model="selectServicePopupVisible" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
            <mt-header fixed title="选择配件">
                <!-- <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left"> -->
                <mt-button icon="back" slot="left" @click.native="selectServicePopupVisible = false">返回</mt-button>
                <mt-button slot="right" @click.native="saveServiceParts">保存</mt-button>
                <!-- </router-link> -->
                <!-- <mt-button icon="more" slot="right"></mt-button> -->
            </mt-header>
            <div class="container-box scroll">
                <div class="page-part info">
                    <mt-cell title="车辆信息"></mt-cell>
                    <!-- <mt-cell title="品牌车型"
                    :label="selectCatStyleData.carType"
                    is-link :value="selectCatStyleData.carTrain === '' ? '选择车型' : selectCatStyleData.carTrain"
                    @click.native="handleSelectBrandCode"
                    ></mt-cell> -->
                    <mt-field label="车牌号：" v-model="form.seCustomerInfo.carNumber" readonly disableClear></mt-field>
                    <mt-cell is-link :title="`车型：${form.seCarInfo.brandCode}`" :label="form.seCarInfo.carType">{{form.seCarInfo.carTrainCode}}</mt-cell>
                    <!-- <mt-field label="车型：" v-model="form.seCarInfo.carType" readonly disableClear></mt-field> -->
                    <mt-field label="排量：" v-model="form.seCarInfo.displacement" readonly disableClear></mt-field>
                    <mt-field label="VIN码：" v-model="form.seCarInfo.vin" readonly disableClear></mt-field>
                    <mt-field label="发动机号：" v-model="form.seCarInfo.engineNumber" readonly disableClear></mt-field>
                    <!-- <mt-field label="行驶里程：" v-model="form.seCarInfo.mileage" readonly disableClear></mt-field>
                    <mt-field label="车辆颜色：" v-model="form.carColor" readonly disableClear></mt-field>
                    <mt-field label="建议保养里程：" v-model="form.seCarInfo.adviseMileageMaintenance" readonly disableClear></mt-field>
                    <mt-field label="建议保养时间：" v-model="form.seCarInfo.adviseMileageTime" readonly disableClear></mt-field>
                    <mt-field label="剩余油量：" v-model="form.seCarInfo.innage" readonly disableClear></mt-field>
                    <mt-field label="车辆外观状况：" v-model="form.seCarInfo.appearance" readonly disableClear></mt-field> -->
                </div>
                <div class="page-part">
                    <mt-cell title="服务项目"></mt-cell>
                    <mt-cell :title="serviceData[serviceActive].title">
                        <mt-button size="small" type="primary" icon="" class="cell-btn">添加工时</mt-button>
                        <!-- <mt-button size="small" type="primary" icon="" @click.native="getFittingindex">添加配件</mt-button> -->
                    </mt-cell>
                    <template v-for="(v, i) in currentParts">
                        <div class="accessories-title" :key="v.name + i">{{v.name}}：</div>
                        <template v-for="(k, j) in v.children">
                            <mt-cell-swipe :key="'swipe' + j" v-if="v.children.length" class="accessories-item" :right="del" :title="`${j + 1}.${k.materialName}`" :label="`编码：${k.materialId}`">{{`数量：${k.number}`}}</mt-cell-swipe>
                        </template>
                    </template>
                    <mt-palette-button class="addPart" content="+" mainButtonStyle="color:#fff;background-color:#26a2ff;" @click.native="getFittingindex">
                        <div class="my-icon-button"></div>
                    </mt-palette-button>
                </div>
            </div>
        </mt-popup>
        <mt-popup :modal="false" v-model="selectServicePopupListVisible" position="right" class="mint-popup-select-car" popup-transition="popup-fade">
            <mt-header fixed title="选择配件">
                <!-- <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left"> -->
                <mt-button icon="back" slot="left" @click.native="selectServicePopupListVisible = false">返回</mt-button>
                <!-- </router-link> -->
                <!-- <mt-button icon="more" slot="right"></mt-button> -->
            </mt-header>
            <div class="parts-list container-box">
                <div class="page-part">
                    <mt-navbar v-model="selected">
                        <template v-for="(v, i) in ['配件', '材料', '设备']">
                            <mt-tab-item :id="`${i}`" :key="v + i + 'material'">{{v}}</mt-tab-item>
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
                    <!-- <mt-tab-container-item id="0">
                        <template v-for="(v, i) in fittingsData[selected]">
                            <mt-cell :title="`${i + 1}.${v.fittingName}`" :key="v.fittingName + i"></mt-cell>
                        </template>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="1">
                        <template v-for="(v, i) in fittingsData[selected]">
                            <mt-cell :title="`${i + 1}.${v.fittingName}`" :key="v.fittingName + i"></mt-cell>
                        </template>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="2">
                        <template v-for="(v, i) in fittingsData[selected]">
                            <mt-cell :title="`${i + 1}.${v.fittingName}`" :key="v.fittingName + i"></mt-cell>
                        </template>
                    </mt-tab-container-item> -->
                </mt-tab-container>
            </div>
        </mt-popup>
        <mt-popup v-model="pickerVisible" position="bottom" class="pickerVisible">
            <mt-cell :title="`选择数量：${selectNum}`">
                <mt-button size="small" type="primary" icon="" class="cell-btn" @click.native="submitAddParts">确定</mt-button>
            </mt-cell>
            <mt-picker :slots="numberSlots" @change="onNumberChange" :visible-item-count="3" :show-toolbar="false"></mt-picker>
        </mt-popup>
        <!-- <mt-actionsheet
            :actions="actions"
            v-model="pickerVisible">
            <div>333</div>
        </mt-actionsheet> -->
    </div>
</template>

<script>
import { carApi, dictionaryApi, comprehensiveApi, fittingApi } from '@/api';
import { catchError } from '@/util';
import * as R from 'ramda';
export default {
    data() {
        return {
            selected: '0',
            selectCarPopupVisible: false, // 车品牌
            popupVisible: false, // 车系
            popupYearVisible: false, // 车年款
            popupModelVisible: false, // 车型号
            showSelectCarList: true, // 车品牌
            popupColorVisible: false, // 车颜色
            sheetVisible: false, // 车辆情况
            popupServiceVisible: false, // 服务项目
            selectServicePopupVisible: false, // 服务项目信息报价
            selectServicePopupListVisible: false, // 配件列表
            pickerVisible: false, // 配件计数器
            selectCarindex: [], // 车品牌列表
            selectCarObj: {}, // 排序后车品牌列表
            // brandName: '',
            // styleName: '',
            // styleId: '',
            // modelName: '',
            selectCarListindex: [], // 车系分类
            selectCarListObj: {}, // 车系分类子项目列表
            serviceValue: {
                // 服务项目选择状态
                title: '',
                serviceIndex: 0
            },
            selectCarYearindex: [], // 车年款
            selectServiceindex: [
                // 服务项目列表
                // {
                //     label: '机修',
                //     value: '机修'
                // },
                // {
                //     label: '保养',
                //     value: '保养'
                // },
                // {
                //     label: '电子',
                //     value: '电子'
                // },
                // {
                //     label: '美容',
                //     value: '美容'
                // },
                // {
                //     label: '钣金',
                //     value: '钣金'
                // },
                // {
                //     label: '喷漆',
                //     value: '喷漆'
                // },
                // {
                //     label: '精品',
                //     value: '精品'
                // },
                // {
                //     label: '内饰翻新',
                //     value: '内饰翻新'
                // },
                // {
                //     label: '轮胎',
                //     value: '轮胎'
                // },
                // {
                //     label: '其他',
                //     value: '其他'
                // }
            ],
            // selectCarYearObj: {},
            selectCarStyle: [], // 车款式
            yearValue: '', // 车年款值
            searchValue: '', // 搜索
            carColors: [
                // 车颜色
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
            comprehensiveStatus: 0, // 综合服务单进度状态
            actions: [
                // 车外观情况
                {
                    name: '不正常',
                    method: () => {
                        console.log(this);
                        this.form.seCarInfo.appearance = 0;
                        this.cacheData.appearance = '不正常';
                    }
                },
                {
                    name: '良好',
                    method: () => {
                        console.log(this);
                        this.form.seCarInfo.appearance = 1;
                        this.cacheData.appearance = '良好';
                    }
                }
            ],
            swipeData: [
                // 服务项目左滑删除样式
                {
                    content: '取消',
                    style: {
                        background: '#ddd',
                        color: '#fff'
                    },
                    handler: () => {
                        console.log(this);
                    }
                },
                {
                    content: '删除',
                    style: {
                        background: 'red',
                        color: '#fff'
                    },
                    handler() {
                        console.log(this);
                    }
                }
            ],
            serviceData: [
                // 服务项目列表状态
                {
                    children: [],
                    title: '',
                    name: '选择服务项目',
                    description: '',
                    value: 0,
                    status: '',
                    serviceProjectId: ''
                }
            ],
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
            selectCatStyleCacheData: {
                // 选择车型状态缓存
                // 选择品牌车型缓存数据
                brand: '',
                brandCode: '',
                carTrain: '',
                carTrainCode: '',
                carType: '',
                carModelYear: ''
            },
            cacheData: {
                brandCode: '选择车型',
                carColor: '请选择车辆颜色',
                appearance: '请选择辆车辆外观状况'
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
                    adviseMileageMaintenance: null, // 建议保养里程
                    adviseMileageTime: '', // 建议保养时间
                    appearance: null, // 车身外观 1 良好 0不正常
                    brandCode: '', // 品牌编码
                    carTrainCode: '', // 车系
                    carModelYear: '', // 车型年款
                    carType: '', // 车型
                    displacement: '', // 排量
                    // buyTime: '2016-05-20 15:50:10',
                    engineNumber: '', // 发动机号
                    innage: null, // 剩余油量
                    // insuranceCompany: '', // 投保公司
                    // insuranceEndTime: '2017-06-20 18:00:00', //
                    mileage: null, // 行驶里程
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
                seProjectList: [
                    // {
                    //     children: [
                    //         // Array[服务单服务子项目
                    //         // {
                    //         //     barCode: 'barCode', // 配件条形码
                    //         //     discount: 50, // 折扣率
                    //         //     feeType: 1, // 收费类型 1工时费 2配件费
                    //         //     number: 5, // 数量
                    //         //     originalPrice: 10, // 仓库原单价
                    //         //     price: 10, // 单价
                    //         //     projectName: 'test', // 名称
                    //         //     serviceProjectId: 4, // 对应的服务单元项目ID
                    //         //     totalAccount: 100.6, //金额
                    //         //     wareDiscount: 50, // 仓库折扣率
                    //         //     workProjectId: 4 //服务工时项目ID
                    //         // }
                    //     ],
                    //     // constructorId: '4', // 施工员ID
                    //     // constructorName: 'xxx', // 施工员名称
                    //     projectName: '', // 服务项目名称
                    //     projectType: 0 // 项目类型 1：保养 2：钣喷 3：美容 4：洗车 5：机修 6：精品 7：改装 8：轮胎 9：其他 ,
                    //     // status: 1, // 状态
                    //     // workProjectId: 4 // 服务工时项目ID
                    // }
                ]
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
                        name: '无法施工',
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
            del: [
                // 项目配件删除样式
                {
                    content: '删除',
                    style: {
                        background: 'red',
                        color: '#fff'
                    },
                    handler: () => {
                        console.log(this);
                    }
                }
            ],
            fittingsData: [
                // 配件列表
                [],
                [],
                []
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
            selectNum: 1, // 配件数量
            picker: null, // 配件数量选择器
            serviceProjectId: 0, // 当前操作服务项目ID
            selectedPart: null,
            currentService: null
        };
    },
    computed: {
        btnText() {
            // return ['确认开单', '确认审批', '用户确认', '确认施工', '请求质检', '完成质检'][this.comprehensiveStatus];
            return this.comprehensiveStatus === 0 ? '确定开单' : '更新资料';
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
                }
            ];
            this.parts.map((v, i) => {
                v.index = i;
                if (v.feeType === 1) {
                    arr[0].children.push(v);
                } else if (v.feeType === 2) {
                    arr[1].children.push(v);
                } else if (v.feeType === 3) {
                    arr[3].children.push(v);
                } else {
                    arr[2].children.push(v);
                }
            });
            return arr;
        }
    },
    methods: {
        async handleSelectBrandCode() {
            const vm = this;
            vm.selectCarPopupVisible = true;
            try {
                const res = await carApi.requestBrand.r();
                console.log(res);
                vm.selectCarindex = R.sort((a, b) => (a > b ? 1 : a === b ? 0 : -1), [
                    ...new Set(R.map(R.prop('firstLetter'))(res.data))
                ]);
                console.log(vm.selectCarindex);
                vm.selectCarObj = {};
                for (let v of res.data) {
                    if (vm.selectCarObj[v.firstLetter]) {
                        vm.selectCarObj[v.firstLetter].children.push(v);
                    } else {
                        vm.selectCarObj[v.firstLetter] = {
                            children: [v]
                        };
                    }
                }
                console.log('selectCarObj', vm.selectCarObj);
            } catch (err) {
                console.error(err);
                catchError(err);
            }
            // this.popupVisible = true;
        },
        async handleSelectCarBrand(brandId, name) {
            console.log(brandId);
            const vm = this;
            vm.popupVisible = true;
            vm.selectCatStyleCacheData.brand = name;
            vm.selectCatStyleCacheData.brandCode = brandId;
            try {
                const res = await carApi.requestStyle.r({ brandId });
                console.log(res);
                vm.selectCarListindex = [...new Set(R.map(R.prop('factoryName'))(res.data))];
                vm.selectCarListObj = {};
                console.log('selectCarListindex', vm.selectCarListindex);
                for (let v of res.data) {
                    if (vm.selectCarListObj[v.factoryName]) {
                        vm.selectCarListObj[v.factoryName].children.push(v);
                    } else {
                        vm.selectCarListObj[v.factoryName] = {
                            children: [v]
                        };
                    }
                }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async handleSelectCarTrain(styleId, name) {
            const vm = this;
            vm.yearValue = '';
            vm.selectCatStyleCacheData.carTrain = name;
            vm.selectCatStyleCacheData.carTrainCode = styleId;
            console.log(styleId);
            try {
                const res = await carApi.requestYear.r({ styleId });
                console.log(res);
                if (res.data.length) {
                    vm.popupYearVisible = true;
                    vm.selectCarYearindex = res.data.map(v => {
                        v.value = v.year;
                        v.label = v.year + '年';
                        return v;
                    });
                } else {
                }
                // console.log(vm.selectCarYearindex);
                // for (let v of res.data) {
                //     if (vm.selectCarYearObj[v.year]) {
                //         vm.selectCarYearObj[v.year].children.push(v);
                //     } else {
                //         vm.selectCarYearObj[v.year] = {
                //             children: [v]
                //         };
                //     }
                // }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async handleSelectCarModelYear(year) {
            // 选择年款
            const vm = this;
            const styleId = vm.selectCatStyleCacheData.carTrainCode;
            vm.selectCatStyleCacheData.carModelYear = year;
            try {
                const res = await carApi.requestModel.r({ styleId, year });
                console.log(res);
                if (res.data.length) {
                    vm.popupModelVisible = true;
                    vm.selectCarStyle = res.data;
                    // vm.selectCarYearindex = res.data.map(v => {
                    //     v.value = v.year;
                    //     v.label = v.year + '年';
                    //     return v;
                    // });
                } else {
                }
                // console.log(vm.selectCarYearindex);
                // for (let v of res.data) {
                //     if (vm.selectCarYearObj[v.year]) {
                //         vm.selectCarYearObj[v.year].children.push(v);
                //     } else {
                //         vm.selectCarYearObj[v.year] = {
                //             children: [v]
                //         };
                //     }
                // }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async getServiceType() {
            try {
                const { data } = await dictionaryApi.request.r({
                    code: 'TYPE_SERVICE'
                });
                console.log('服务项目', data);
                this.selectServiceindex = data.TYPE_SERVICE.map(v => {
                    return {
                        label: v.dicName,
                        value: v.dicName
                    };
                });
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async saveSubmit() {
            const serviceData = this.serviceData;
            if (serviceData.length > 1) {
                const _seProjectList = R.slice(0, serviceData.length - 1)(serviceData);
                this.form.seProjectList = [];
                for (let v of Object.values(_seProjectList)) {
                    this.form.seProjectList.push({
                        projectName: v.title,
                        projectType: v.value,
                        status: v.status,
                        description: v.description,
                        children: []
                    });
                }
            }
            this.form.seCarInfo = R.merge(this.form.seCarInfo, this.selectCatStyleData);
            this.form.seCarInfo.carTrainCode = this.selectCatStyleData.carTrain;
            this.form.seCarInfo.brandCode = this.selectCatStyleData.brand;
            console.log(this.form);
            try {
                const { data } = await comprehensiveApi.save.r(this.form);
                console.log(data);
                this.form.comprehensiveCd = data.comprehensiveCd;
                this.form.comprehensiveId = data.comprehensiveId;
                this.form.createDate = data.createDate;
                this.form.updateDate = data.updateDate;
                this.$toast({
                    message: '保存成功!',
                    iconClass: 'icon icon-success',
                    duration: 2000
                });
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async saveServiceParts() {
            // 保存服务项目报价
            const that = this;
            try {
                const result = await this.$message({
                    title: '提示',
                    message: '确定保存服务项目信息？',
                    showCancelButton: true
                });
                if (result === 'confirm') {
                    that.currentService.children = this.parts;
                    const res = await comprehensiveApi.seproject.r([that.currentService]);
                    console.log(res);
                    this.$toast({
                        message: `保存成功!`,
                        iconClass: 'icon icon-success',
                        duration: 2000
                    });
                    this.selectServicePopupVisible = false;
                }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        handleSelectCarType(name) {
            this.selectCatStyleCacheData.carType = name;
        },
        cancelSelectCarType() {
            this.selectCarPopupVisible = false;
            this.popupVisible = false;
            this.popupYearVisible = false;
            this.popupModelVisible = false;
            for (let k of Object.keys(this.selectCatStyleCacheData)) {
                this.selectCatStyleCacheData[k] = '';
            }
        },
        checkedCarType() {
            this.selectCatStyleData = R.merge({}, this.selectCatStyleCacheData);
            this.cancelSelectCarType();
        },
        handleSelectCarColor(color) {
            this.cacheData.carColor = color;
            this.form.seCarInfo.carColor = color;
            this.popupColorVisible = false;
            console.log(color);
        },
        handleOpenSelectService(i) {
            // 打开可选服务项目列表
            this.popupServiceVisible = true;
            this.serviceValue.serviceIndex = i;
            this.serviceValue.title = this.serviceData[i].title;
            console.log(this.serviceValue.title);
        },
        async handleSelectService(v) {
            // 确定选择服务项目
            console.log(v);
            const labels = R.map(R.prop('label'))(this.selectServiceindex);
            const index = this.serviceValue.serviceIndex;
            this.serviceData[index].title = v;
            this.serviceData[index].name = '';
            this.serviceData[index].value = labels.indexOf(v) + 1;
            const serviceData = this.serviceData;
            if (index >= this.serviceData.length - 1) {
                this.serviceData.push({
                    title: '',
                    name: '选择服务项目',
                    description: '',
                    value: 0,
                    serviceProjectId: ''
                });
            }
            if (serviceData.length > 1) {
                const _seProjectList = R.slice(0, serviceData.length - 1)(serviceData);
                // this.form.seProjectList = [];
                const seProjectList = _seProjectList.map((v, i) => {
                    return {
                        children: v.children,
                        comprehensiveId: this.form.comprehensiveId,
                        constructorId: '',
                        constructorName: '',
                        description: v.description,
                        projectName: v.title,
                        projectType: v.value,
                        serviceProjectId: v.serviceProjectId
                    };
                });
                console.log('选择项目', seProjectList);
                try {
                    const res = await comprehensiveApi.seproject.r(seProjectList);
                    console.log('新增服务项目后', res);
                    this.serviceData = res.map((v, i) => {
                        return {
                            title: v.projectName,
                            name: '',
                            description: v.description,
                            value: v.projectType,
                            serviceProjectId: v.serviceProjectId,
                            status: v.status,
                            children: seProjectList[i].children
                        };
                    });
                    this.serviceData.push({
                        title: '',
                        name: '选择服务项目',
                        description: '',
                        value: 0,
                        serviceProjectId: '',
                        status: '',
                        children: []
                    });
                } catch (err) {
                    console.error(err);
                    catchError(err);
                }
            }
            this.popupServiceVisible = false;
        },
        // inputFunc (v) {
        //     this.serviceData[this.serviceValue.serviceIndex].describe = v;
        // },
        // focusFunc (i) {
        //     console.log(i);
        //     this.serviceValue.serviceIndex = i;
        // },
        async comprehensiveSubmit() {
            console.log('submit');
            this.comprehensiveStatus++;
            const serviceData = this.serviceData;
            if (serviceData.length > 1) {
                const _seProjectList = R.slice(0, serviceData.length - 1)(serviceData);
                this.form.seProjectList = [];
                for (let v of Object.values(_seProjectList)) {
                    this.form.seProjectList.push({
                        projectName: v.title,
                        projectType: v.value,
                        status: v.status,
                        children: []
                    });
                }
            }
            this.form.seCarInfo = R.merge(this.form.seCarInfo, this.selectCatStyleData);
            console.log(this.form);
            try {
                const { data } = await comprehensiveApi.save.r(this.form);
                console.log(data);
                this.form.comprehensiveCd = data.comprehensiveCd;
                this.form.comprehensiveId = data.comprehensiveId;
                this.form.createDate = data.createDate;
                this.form.updateDate = data.updateDate;
                this.$toast({
                    message: '开单成功!',
                    iconClass: 'icon icon-success',
                    duration: 2000
                });
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async changeComprehensiveStatus() {
            this.comprehensiveStatus++;
            if (this.comprehensiveStatus === 2) {
                this.comprehensiveStatus++;
            }
            try {
                const result = await this.$message({
                    title: '提示',
                    message: '确定执行此操作？',
                    showCancelButton: true
                });
                if (result === 'confirm') {
                    const res = await comprehensiveApi.updateSchedule.r({
                        billId: this.form.comprehensiveId,
                        status: this.comprehensiveStatus
                    });
                    console.log(res);
                    this.$toast({
                        message: `已${this.btnText}!`,
                        iconClass: 'icon icon-success',
                        duration: 2000
                    });
                }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async handleQuery(id) {
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
                    status: 1,
                    param: '',
                    page: 1,
                    pageSize: 9999
                });
                console.log(data[0]);
                this.form = R.merge(this.form, data[0]);
                this.comprehensiveStatus = this.form.status;
                // this.selectCatStyleData.carType = this.form.seCarInfo.carType;
                // this.selectCatStyleData.carTrain = this.form.seCarInfo.carTrainCode;
                this.selectCatStyleData = R.merge({}, this.form.seCarInfo);
                this.selectCatStyleData.carTrain = this.form.seCarInfo.carTrainCode;
                if (this.form.seCarInfo.carColor !== '') {
                    this.cacheData.carColor = this.form.seCarInfo.carColor;
                }
                this.cacheData.appearance = this.actions[this.form.seCarInfo.appearance].name;
                const serviceData = this.form.seProjectList.map(v => {
                    return {
                        title: v.projectName,
                        projectName: v.projectName,
                        name: '',
                        comprehensiveId: v.comprehensiveId,
                        constructorId: '',
                        constructorName: '',
                        description: v.description,
                        value: v.projectType,
                        projectType: v.projectType,
                        status: v.status,
                        serviceProjectId: v.serviceProjectId,
                        children: v.children
                    };
                });
                this.serviceData = [...serviceData, ...this.serviceData];
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        handleSubmit() {
            // if (this.comprehensiveStatus === 1) {
            //     this.comprehensiveSubmit();
            // } else {
            //     this.changeComprehensiveStatus();
            // }
            this.comprehensiveSubmit();
        },
        async workStateMethods(i, status) {
            console.log('status', status);
            const that = this;
            const project = that.serviceData[i];
            console.log('project', project);
            that.currentService = project;
            // const comprehensiveId = that.form.comprehensiveId;
            const fns = {
                toQuote() {
                    that.selectServicePopupVisible = true;
                    that.serviceActive = i;
                    that.parts = R.clone(project.children);
                },
                approve() {
                    console.log('提交');
                },
                construction() {
                    console.log('下派');
                },
                constructionIng() {
                    console.log('开始施工');
                },
                testing() {
                    console.log('质检');
                },
                finish() {
                    console.log('完成');
                }
            };
            fns[status.value]();
            try {
                if (status.state !== 1) {
                    const { data } = await comprehensiveApi.seprojectUpdateStatus.r({
                        serviceProjectId: project.serviceProjectId,
                        status: status.state
                    });
                    console.log(data);
                    project.status = data.status;
                }
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async getFittingindex() {
            const that = this;
            that.selectServicePopupListVisible = true;
            if (that.fittingsData[that.selected].length === 0) {
                const arr = R.clone(that.fittingsData);
                try {
                    const { data } = await fittingApi.inventoryFitting.r({
                        // inventoryFlag: true,
                        // fittingId: 34,
                        classifyId: that.selected - 0 + 1,
                        // param: '',
                        page: 1,
                        pageSize: 99999
                    });
                    console.log('配件列表', data);
                    arr[that.selected] = data;
                    that.fittingsData = arr;
                    console.log(that.fittingsData);
                } catch (err) {
                    console.error(err);
                    catchError(err);
                }
            }
        },
        openSelectNum(part) {
            // 配件数量选择
            console.log('配件', part);
            this.selectedPart = part;
            this.pickerVisible = true;
            if (this.pciker !== null) {
                this.picker.setSlotValue(0, '1');
            }
            this.numberSlots[0].defaultIndex = 0;
            this.selectNum = '1';
        },
        onNumberChange(picker, values) {
            console.log(values[0]);
            this.selectNum = values[0];
            if (this.picker === null) {
                this.picker = picker;
            }
        },
        submitAddParts() {
            // 确定添加配件
            const partsName = R.map(R.prop('projectName'))(this.parts);
            const index = partsName.indexOf(this.selectedPart.projectName);
            console.log(partsName);
            console.log(index);
            console.log(this.selectedPart);
            this.selectedPart.number = this.selectNum;
            this.selectedPart.feeType = this.selectedPart.classifyId;
            this.selectedPart.materialId = this.selectedPart.classifyId;
            this.selectedPart.serviceProjectId = this.currentService.serviceProjectId;
            this.selectedPart.totalAccount = 0;
            this.parts.push(this.selectedPart);
            // if (index !== -1) {
            //     this.parts[index].number += this.selectNum;
            // } else {
            //     this.parts.push(this.selectedPart);
            // }
            this.pickerVisible = false;
        },
        async deleteServiceProject(i) {
            console.log(i);
        }
    },
    watch: {
        selectCarPopupVisible(v) {
            console.log(v);
            if (v) this.$refs.list.$el.querySelector('.mint-indexlist-content').style.height = null;
        }
    },
    created() {
        this.getServiceType();
        const id = this.$route.query.id;
        if (id) {
            this.handleQuery(id);
        }
    },
    mounted() {}
};
</script>

<style lang="postcss">
.container-box {
    background: #eee;
    &.scroll {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    }
}
.page-part {
    padding-bottom: 15px;
    .mint-field {
        .mint-cell-title {
            width: 115px;
            // text-align: right;
            span {
                display: inline-block;
            }
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
        margin-top: 50px;
        .mint-cell {
            min-height: 20px;
            &:last-child {
                background: #fff;
            }
        }
        .mint-field {
            .mint-cell-title {
                width: 80px;
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
    &:last-child {
        background: none;
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
    transform: translate3d(-12%, -50%, 0);
    background: none;
}
.select-list-wrap {
    position: fixed;
    width: 100%;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    transition: all 0.3s;
    overflow: scroll;
    transform: translate3d(100%, 0, 0);
    .mint-indexsection:last-child {
        margin-bottom: 50px;
    }
    &.active {
        transform: translate3d(0, 0, 0);
    }
    &.checked {
        transform: translate3d(-38%, 0, 0);
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
</style>
