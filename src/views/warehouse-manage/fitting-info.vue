<template>
    <div style="background: #fafafa;">
        <mt-header fixed :title="(isEdit? '修改' : '新增') + classifyName(classifyId)">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
        </mt-header>
        <fitting v-if="classifyId == 1" :fittingInfo="info" :isEdit="isEdit"></fitting>
        <material v-if="classifyId == 2" :fittingInfo="info" :isEdit="isEdit"></material>
        <equipment v-if="classifyId == 3" :fittingInfo="info" :isEdit="isEdit"></equipment>
    </div>
</template>
<script>
import fitting from './fittingCom'
import material from './materialCom'
import equipment from './equipmentCom'
export default {
    data() {
        return {
            isEdit: false,
            classifyId: '',
            info: {
                barCode: '', // 条形码
                brand: '', // 品牌
                buyingPrice: null, // 采购价
                carSeries: '', // 车型系列
                classifyId: 1, // 所属配件分类
                code: '', // 编码
                deviceType: '1', // 设备类型
                extra: '', // 附件
                fitCar: '', // 适用车型
                freight: null, // 运费
                materialName: '', // 物料名称
                num: null, // 数量
                originPlace: '', // 产地
                prices: [
                    {
                        price: null, // 售价
                        priceName: '售价' // 价格名称
                    }
                ],
                specification: '', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            }
        }
    },
    components: {
        fitting,
        material,
        equipment
    },
    created() {
        if (this.$route.params.fittingInfo) {
            this.isEdit = true
            this.info = this.$route.params.fittingInfo
        }
        if (this.$route.params.classifyId) {
            this.classifyId = this.$route.params.classifyId
        }
    },
    methods: {
        classifyName(id) {
            let name = {
                '1': '配件',
                '2': '材料',
                '3': '设备'
            }
            return name[id]
        }
    }
}
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
.tcth-field-required .mint-cell-text {
    color: red;
}
.tcth-field-required .mint-cell-text::before {
    content: '*';
    position: absolute;
    top: 20px;
    left: 0;
}
.mint-popup-car {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.mint-popup-style {
    width: 80%;
    height: 100%;
    background-color: #fff;
}
.style-indexlist .mint-indexlist-nav {
    display: none;
}
.mint-toast {
    z-index: 9999;
}
.tcth-danger-desc {
    color: red;
    font-size: 0.7rem;
    text-align: center;
}
</style>
