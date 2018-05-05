<template>
    <div style="background: #fafafa;">
        <mt-header fixed title="配件新增/修改">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div style="padding-top:40px;padding-bottom:53px; backgroung: #000">
            <div style="margin-bottom: 10px;">
                <mt-field label="条形码" placeholder="扫一扫" v-model="fittingInfo.barCode"></mt-field>
                <mt-field label="材料名称" placeholder="请输入材料名称" v-model="fittingInfo.materialName"></mt-field>
                <mt-field label="规格" placeholder="请输入规格" v-model="fittingInfo.barCode"></mt-field>
                <mt-field label="适用车型" placeholder="请选择适用车型" v-model="fittingInfo.barCode"></mt-field>
                <mt-field label="单位" placeholder="请输入单位" v-model="fittingInfo.barCode"></mt-field>
                <mt-field label="产地" placeholder="请输入产地" v-model="fittingInfo.barCode"></mt-field>
            </div>
            <div style="margin-bottom: 29px;">
                <mt-radio title="规格" v-model="value" :options="['通用', '左(L)', '右(R)']">
                </mt-radio>
            </div>
            <div>
                <mt-field label="仓位" placeholder="请输入仓位" v-model="fittingInfo.barCode"></mt-field>
                <mt-field label="采购价" placeholder="请输入采购价" type="number" v-model="fittingInfo.buyingPrice"></mt-field>
                <mt-field label="数量" placeholder="请输入数量" type="number" v-model="fittingInfo.num"></mt-field>
                <mt-field label="运费" placeholder="请输入运费" type="number" v-model="fittingInfo.freight"></mt-field>
                <mt-field v-for="(item,index) in fittingInfo.prices" :key="index" :label="item.priceName" placeholder="请输入售价" type="number" v-model="item.price">
                    <mt-button size="small">重置</mt-button>
                </mt-field>
            </div>
        </div>
        <div style="position: fixed;bottom: 0;background: rgba(0,0,0,0.5);width: 100%;padding: 10px;">
            <mt-button size="small">重置</mt-button>
            <mt-button size="small">入库</mt-button>
            <mt-button size="small">继续入库</mt-button>
        </div>
    </div>
</template>
<script>
import fitting from './fitting';
import material from './material';
import equipment from './equipment';

export default {
    data() {
        return {
            // value: '搜索',
            selected: '1',
            fittingInfo: {
                barCode: '', // 条形码
                brand: '', // 品牌
                buyingPrice: 0, // 采购价
                carSeries: '', // 车型系列
                classifyId: 1, // 所属配件分类
                code: '', // 编码
                deviceType: 1, // 设备类型
                extra: '', // 附件
                fitCar: '', // 适用车型
                freight: 0, // 运费
                materialName: '', // 物料名称
                num: 1, // 数量
                originPlace: '', // 产地
                prices: [
                    {
                        id: 0,
                        materialId: 0, // 配件ID,
                        price: 0, // 售价
                        priceName: '售价' // 价格名称
                    },
                    {
                        id: 0,
                        materialId: 0, // 配件ID,
                        price: 0, // 售价
                        priceName: '售价2' // 价格名称
                    }
                ],
                specification: '', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            }
        };
    },
    components: {
        fitting,
        material,
        equipment
    }
};
</script>
<style>
/* .container-box div + div{
    margin: 10px 0;
} */
.fitting-container {
    margin-bottom: 50px;
}
.cart {
    position: fixed;
    bottom: 0;
    color: #fff;
    background: rgba(0, 0, 0, 0.6);
    padding: 5px;
    width: 100%;
    /* height: 40px; */
    line-height: 40px;
}
</style>
