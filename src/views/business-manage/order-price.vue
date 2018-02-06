<template>
    <div class="container-box">
        <div class="page-part">
            <mt-cell title="送修人信息"></mt-cell>
            <mt-field label="送修人：" placeholder="请输入送修人名称"></mt-field>
            <mt-field label="联系号码：" placeholder="请输入联系手机号码" type="tel"></mt-field>
            <mt-field label="车牌号码：" placeholder="请输入车牌号码"></mt-field>
            <mt-field label="住址：" placeholder="请输入住址" ></mt-field>
        </div>
        <div class="page-part">
            <mt-cell title="车辆信息"></mt-cell>
            <mt-cell title="品牌车型" is-link :value="cacheData.brandCode" @click.native="handleSelectBrandCode"></mt-cell>
            <mt-field label="排量：" placeholder="请输入排量"></mt-field>
            <mt-field label="VIN码：" placeholder="请输入VIN码" type="tel"></mt-field>
            <mt-field label="发动机号：" placeholder="请输入发动机号"></mt-field>
            <mt-field label="行驶里程：" placeholder="请输入行驶里程" ></mt-field>
            <mt-cell title="车辆颜色：" is-link :value="cacheData.carColor" ></mt-cell>
            <mt-field label="建议保养里程：" placeholder="请输入建议保养里程" ></mt-field>
            <mt-field label="建议保养时间：" placeholder="请输入建议保养时间" ></mt-field>
            <mt-field label="剩余油量：" placeholder="请输入剩余油量" ></mt-field>
            <mt-cell title="车辆外观状况：" is-link :value="cacheData.appearance" ></mt-cell>
        </div>
        <div class="page-part">
            <mt-cell title="需求信息" is-link></mt-cell>
            <mt-cell is-link>
                选择服务项目
            </mt-cell>
                <!-- <mt-button type="primary" size="small" class="cell-btn">添加</mt-button> -->
            <mt-cell is-link>备注</mt-cell>
        </div>
        <div class="page-part">
            <mt-cell title="服务报价信息" is-link></mt-cell>
            <mt-cell title="服务项目1（机修)" label="发动机大修">
                <mt-button type="primary" size="small" class="cell-btn">进入仓库</mt-button>
                <mt-button type="primary" size="small">添加工时</mt-button>
            </mt-cell>
        </div>
        <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        position="right"
        >
        </mt-popup>
        <mt-popup
        :modal="false"
        v-model="selectCarPopupVisible"
        position="right"
        class="mint-popup-select-car"
        popup-transition="popup-fade">
            <mt-search
            v-model="searchValue"
            :show="showSelectCarList"
            cancel-text="取消"
            placeholder="搜索">
                <mt-index-list class="car-list" ref="list">
                    <template v-for="(v, i) in selectCarindex">
                        <mt-index-section v-if="selectCarindex.length" :index="v" :key="i">
                            <template v-for="(j, k) in selectCarObj[v].children">
                                <mt-cell :title="j.brandName" :key="k" is-link @click.native="handleSelectCar(j.id)"></mt-cell>
                            </template>
                        </mt-index-section>
                    </template>
                </mt-index-list>
            </mt-search>
        </mt-popup>
    </div>
</template>

<script>
import { carApi } from '@/api';
import { catchError } from '@/util';
import * as R from 'ramda';
export default {
    data() {
        return {
            selectCarPopupVisible: false,
            showSelectCarList: true,
            selectCarindex: [],
            selectCarObj: {},
            popupVisible: false,
            searchValue: '',
            cacheData: {
                brandCode: '选择车型',
                carColor: '请选择车辆颜色',
                appearance: '请选择辆车辆外观状况'
            },
            form: {
                serviceType: [],
                comprehensiveCd: '', //
                comprehensiveId: 0, //
                customerRequest: '', //
                // dispatchReport: 'xxxx', //
                errorDescription: '', // 故障描述
                // inspectorId: 1, //
                maintenanceSuggestion: '', //
                orderType: 1, // 单据类型 1.综合服务单 2 工时快速单 ,
                remark: '', // 备注
                reservationId: 0, // 预约单ID
                seCarInfo: { // 车辆信息
                    adviseMileageMaintenance: null, // 建议保养里程
                    adviseMileageTime: '', // 建议保养时间
                    appearance: null, // 车身外观 1 良好 0不正常
                    brandCode: '', // 品牌编码
                    // buyTime: '2016-05-20 15:50:10', //
                    // carModelYear: 'string', //
                    // carTrainCode: 'string', //
                    // carType: 'string', //
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
                seCustomerInfo: { // 送修人信息
                    carNumber: '', // 车牌号码：
                    customerAddress: '', // 顾客地址
                    // customerFrom: 1, //
                    customerName: '', // 送修人
                    // dispatchReport: '出车报告', //
                    // endTime: '2017-06-20 19:20:20', //
                    // planEndTime: '2017-06-30 19:20:20', //
                    // remark: '备注', //
                    // sendPeople: '', // 送修人
                    sendPeopleTel: '', // 送修人电话
                    serviceAdvisor: 1, // 服务顾问
                    serviceProperty: 1, // 服务性质
                    serviceType: [], // 需求信息
                    startTime: new Date(), // 开始时间
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
                    //         //Array[服务单服务子项目
                    //         {
                    //             barCode: 'barCode', // 配件条形码
                    //             discount: 50, // 折扣率
                    //             feeType: 1, // 收费类型 1工时费 2配件费
                    //             number: 5, // 数量
                    //             originalPrice: 10, // 仓库原单价
                    //             price: 10, // 单价
                    //             projectName: 'test', // 名称
                    //             serviceProjectId: 4, // 对应的服务单元项目ID
                    //             totalAccount: 100.6, //金额
                    //             wareDiscount: 50, // 仓库折扣率
                    //             workProjectId: 4 //服务工时项目ID
                    //         }
                    //     ],
                    //     constructorId: '4', // 施工员ID
                    //     constructorName: 'xxx', // 施工员名称
                    //     projectName: 'test', // 服务项目名称
                    //     projectType: 1, // 项目类型 1：保养 2：钣喷 3：美容 4：洗车 5：机修 6：精品 7：改装 8：轮胎 9：其他 ,
                    //     status: 1, // 状态
                    //     workProjectId: 4 // 服务工时项目ID
                    // }
                ]
                // totalAccessoryFee: 120.5, //
                // totalExtraFee: 120.5, //
                // totalFee: 220.5, //
                // totalHourFee: 100.5 //
            }
        };
    },
    methods: {
        async handleSelectBrandCode () {
            const vm = this;
            vm.selectCarPopupVisible = true;
            try {
                const res = await carApi.requestBrand.r();
                console.log(res);
                vm.selectCarindex = R.sort((a, b) => a > b ? 1 : a === b ? 0 : -1, [...new Set(R.map(R.prop('firstLetter'))(res.data))]);
                console.log(vm.selectCarindex);
                for (let v of res.data) {
                    if (vm.selectCarObj[v.firstLetter]) {
                        vm.selectCarObj[v.firstLetter].children.push(v);
                    } else {
                        vm.selectCarObj[v.firstLetter] = {
                            children: [v]
                        };
                    }
                }
                console.log(vm.selectCarObj);
            } catch (err) {
                console.error(err);
                catchError(err);
            }
            // this.popupVisible = true;
        },
        async handleSelectCar (brandId) {
            console.log(brandId);
            this.popupVisible = true;
            try {
                const res = await carApi.requestStyle.r({brandId});
                console.log(res);
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        }
    },
    watch: {
        selectCarPopupVisible (v) {
            console.log(v);
            if (v) this.$refs.list.$el.querySelector('.mint-indexlist-content').style.height = null;
        }
    },
    created () {},
    mounted () {
    }
};
</script>

<style lang="postcss">
    .container-box {
        background: #eee
    }
    .page-part{
        margin-bottom: 15px;
        .mint-field {
            .mint-cell-title {
                width: 115px;
                // text-align: right;
                span {
                    display: inline-block;
                }
            }
        }
    }
    .cell-btn{
        margin-right: 10px;
    }
    .mint-popup-select-car{
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .car-list {
        position: absolute;
        left: 0;
        right: 0;
        top: 52px;
        bottom: 0;
        height:auto;
        overflow: scroll;
        z-index: 5;
        .mint-cell-allow-right:after{
            border: none;
        }
        .mint-indexlist-content{
            position: absolute;
            // padding-top: 52px;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
        }
    }
</style>
