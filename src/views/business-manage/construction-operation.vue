<template>
    <div class="container-box">
        <div class="page-part info">
            <mt-cell title="车辆信息"></mt-cell>
            <!-- <mt-cell title="品牌车型"
            :label="selectCatStyleData.carType"
            is-link :value="selectCatStyleData.carTrain === '' ? '选择车型' : selectCatStyleData.carTrain"
            @click.native="handleSelectBrandCode"
            ></mt-cell> -->
            <mt-field label="车型：" v-model="carType" readonly disableClear></mt-field>
            <mt-field label="排量：" v-model="form.seCarInfo.displacement" readonly disableClear></mt-field>
            <mt-field label="VIN码：" v-model="form.seCarInfo.vin" readonly disableClear></mt-field>
            <mt-field label="发动机号：" v-model="form.seCarInfo.engineNumber" readonly disableClear></mt-field>
            <mt-field label="行驶里程：" v-model="form.seCarInfo.mileage" readonly disableClear></mt-field>
            <mt-field label="车辆颜色：" v-model="form.carColor" readonly disableClear></mt-field>
            <mt-field label="建议保养里程：" v-model="form.seCarInfo.adviseMileageMaintenance" readonly disableClear></mt-field>
            <mt-field label="建议保养时间：" v-model="form.seCarInfo.adviseMileageTime" readonly disableClear></mt-field>
            <mt-field label="剩余油量：" v-model="form.seCarInfo.innage" readonly disableClear></mt-field>
            <mt-field label="车辆外观状况：" v-model="form.seCarInfo.appearance" readonly disableClear></mt-field>
        </div>
        <div v-for="(v, i) in form.seProjectList" class="page-part" :key="v.comprehensiveCd">
            <mt-cell v-if="i === 0" title="服务项目"></mt-cell>
            <mt-cell :title="`${i- 0 + 1}. ${v.projectName}`" ><mt-button size="small" type="primary" icon="" :disabled="v.status === 2 ? true: false" @click.native="handleConstruct(v.serviceProjectId, v)">{{projectState[v.status]}}</mt-button></mt-cell>
            <div class="accessories-title">配件：</div>
            <!-- <mt-cell class="accessories-item" title="1.雨刮" label="配件编码：33333">数量：2</mt-cell>
            <mt-cell class="accessories-item" title="2.雨刮" label="配件编码：33333">数量：2</mt-cell> -->
            <div class="accessories-title">材料：</div>
            <!-- <mt-cell class="accessories-item" title="1.雨刮" label="属性1">数量：2</mt-cell>
            <mt-cell class="accessories-item" title="2.雨刮" label="属性1">数量：2</mt-cell>
            <mt-cell class="accessories-item" title="3.雨刮" label="属性1">数量：2</mt-cell> -->
            <div class="accessories-title">工时：</div>
            <!-- <mt-cell class="accessories-item" title="1.发动机大修" >金额：50元</mt-cell> -->
            <div class="accessories-title">设备：</div>
            <!-- <mt-cell class="accessories-item" title="1.板手" label="设备编码：33333">数量：2</mt-cell> -->
        </div>
        <!-- <div class="page-part">
            <mt-cell title="2.美容"><mt-button size="small" type="primary" icon="">开始施工</mt-button></mt-cell>
        </div> -->
    </div>
</template>

<script>
import { constructApi } from '@/api';
import { catchError } from '@/util';
import * as R from 'ramda';
export default {
    data () {
        return {
            carType: '',
            projectState: [
                '施工',
                '完工',
                '质检中'
            ],
            form: {
                seCarInfo: { // 车辆信息
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
                seProjectList: []
            }
        };
    },
    methods: {
        async handleQuery (id) {
            console.log(this.R);
            try {
                const { data } = await constructApi.request.r({
                    accountSquared: '',
                    operatorId: '',
                    serviceType: '',
                    comprehensiveId: id,
                    fromDate: '',
                    endDate: '',
                    orderType: 0,
                    orderStyle: 0,
                    status: 3,
                    param: '',
                    page: 1,
                    pageSize: 9999
                });
                console.log(data[0]);
                this.form = R.merge(this.form, data[0]);
                this.carType = `${this.form.seCarInfo.brandCode} ${this.form.seCarInfo.carType}`;
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        },
        async handleConstruct (serviceProjectId, item) {
            try {
                const { data } = await constructApi.setConstruct.r({
                    serviceProjectId
                });
                item.status = data.status;
            } catch (err) {
                console.error(err);
                catchError(err);
            }
        }
    },
    created () {
        const id = this.$route.query.id;
        if (id) {
            this.handleQuery(id);
        }
    }
};
</script>

<style lang="postcss">
    .container-box {
        background: #eee;
    }
    .page-part{
        padding-bottom: 15px;
        &.info {
            margin-top: 15px;
            .mint-cell{
                min-height: 20px;
            }
            .mint-field {
                .mint-cell-title {
                    width: 80px;
                    // text-align: right;
                    span {
                        display: inline-block;
                    }
                }
                &:nth-child(2),
                &:nth-child(3) {
                    .mint-cell-title {
                        width: 50px;
                    }
                }
                &:nth-child(4) {
                    .mint-cell-title {
                        width: 60px;
                    }
                }
                &:nth-child(8),
                &:nth-child(9),
                &:nth-child(11){
                    .mint-cell-title {
                        width: 115px;
                    }
                }
            }
        }
        .accessories-title {
            padding: 0 10px;
            background: #fff;
            font-size: 14px;
            color: #000;
        }
        .accessories-item{
            .mint-cell-title,
            .mint-cell-value {
                font-size: 14px;
                color: #999;
            }
        }
    }
</style>
