<template>
    <div style="background: #fafafa;">
        <mt-header fixed :title="(isEdit? '修改' : '新增') + classifyName(classifyId)">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
        </mt-header>
        <fitting v-if="classifyId == 1" :fittingInfo="info" :isEdit="isEdit" @refresh="refresh"></fitting>
        <material v-if="classifyId == 2" :fittingInfo="info" :isEdit="isEdit" @refresh="refresh"></material>
        <equipment v-if="classifyId == 3" :fittingInfo="info" :isEdit="isEdit" @refresh="refresh"></equipment>
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
                specification: '通用', // 规格
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
        },
        refresh() {
            this.info = {
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
                specification: '通用', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            }
        }
    }
}
// import { MessageBox, Toast } from 'mint-ui'
// import { fittingApi, carApi } from '@/api'

// export default {
//     data() {
//         return {
//             popupVisibleBrand: false,
//             popupVisibleStyle: false,
//             popupVisiblePrices: false,
//             toastVisibleDesc: false,
//             value: '通用',
//             selected: '1',
//             fittingInfo: {
//                 barCode: '', // 条形码
//                 brand: '', // 品牌
//                 buyingPrice: null, // 采购价
//                 carSeries: '', // 车型系列
//                 classifyId: 1, // 所属配件分类
//                 code: '', // 编码
//                 deviceType: 1, // 设备类型
//                 extra: '', // 附件
//                 fitCar: '', // 适用车型
//                 freight: null, // 运费
//                 materialName: '', // 物料名称
//                 num: null, // 数量
//                 originPlace: '', // 产地
//                 prices: [
//                     {
//                         price: null, // 售价
//                         priceName: '售价' // 价格名称
//                     }
//                 ],
//                 specification: '通用', // 规格
//                 status: 1, // 状态 0:下架 1：上架
//                 unit: '', // 单位
//                 warehouse: '' // 仓位
//             },
//             popFormRules: {
//                 barCode: {
//                     required: true,
//                     message: '条形码不能为空',
//                     error: false
//                 },
//                 materialName: {
//                     required: true,
//                     message: '配件名不能为空',
//                     error: false
//                 },
//                 carSeries: {
//                     required: true,
//                     message: '请选择适用车型',
//                     error: false
//                 },
//                 buyingPrice: {
//                     required: true,
//                     message: '采购价不能为空',
//                     error: false
//                 },
//                 num: {
//                     required: true,
//                     message: '数量不能为空',
//                     error: false
//                 },
//                 price: {
//                     required: true,
//                     message: '售价不能为空',
//                     error: false
//                 }
//             },
//             options: [
//                 {
//                     label: '通用',
//                     value: '通用'
//                 },
//                 {
//                     label: '左(L)',
//                     value: '左(L)'
//                 },
//                 {
//                     label: '右(R)',
//                     value: '右(R)'
//                 }
//             ],
//             brandlist: [],
//             stylelist: [],
//             newPrices: [],
//             isEdit: false
//         }
//     },
//     components: {
//         MessageBox,
//         Toast
//     },
//     created() {
//         if (this.$route.params.fittingInfo) {
//             this.isEdit = true
//             this.fittingInfo = this.$route.params.fittingInfo
//         }
//         this.getCarBrand()
//     },
//     methods: {
//         getCarBrand() {
//             carApi.requestBrand.r().then(res => {
//                 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(initial => {
//                     let cells = res.data.filter(brand => brand.firstLetter === initial)
//                     if (cells.length > 0) {
//                         this.brandlist.push({
//                             initial,
//                             cells
//                         })
//                     }
//                 })
//             })
//         },
//         requiredData() {
//             let result = true
//             if (this.fittingInfo.materialName === '') {
//                 result = false
//             }
//             if (this.fittingInfo.carSeries === '') {
//                 result = false
//             }
//             if (!this.isEdit) {
//                 if (this.fittingInfo.buyingPrice === null || this.fittingInfo.buyingPrice === '') {
//                     result = false
//                 }
//             }
//             if (!this.isEdit) {
//                 if (this.fittingInfo.num === null || this.fittingInfo.num === '') {
//                     result = false
//                 }
//             }
//             this.fittingInfo.prices.forEach(element => {
//                 if (element.price === null || element.price === '') {
//                     result = false
//                 }
//             })
//             return result
//         },
//         edit() {
//             console.log('修改')
//             if (this.requiredData()) {
//                 fittingApi.saveFitting.r(this.fittingInfo).then(response => {
//                     Toast({
//                         message: '修改成功',
//                         duration: 3000
//                     })
//                 })
//             } else {
//                 Toast('请输入红色字体必填项')
//             }
//         },
//         save() {
//             if (this.requiredData()) {
//                 fittingApi.saveFitting.r(this.fittingInfo).then(response => {
//                     if (response.status === 200) {
//                         Toast({
//                             message: '入库成功',
//                             duration: 3000
//                         })
//                         this.$router.go(-1)
//                     } else {
//                         Toast({
//                             message: response.message,
//                             duration: 3000
//                         })
//                     }
//                 })
//             } else {
//                 Toast('请输入红色字体必填项')
//             }
//         },
//         refresh() {
//             this.fittingInfo = {
//                 barCode: '', // 条形码
//                 brand: '', // 品牌
//                 buyingPrice: null, // 采购价
//                 carSeries: '', // 车型系列
//                 classifyId: 1, // 所属配件分类
//                 code: '', // 编码
//                 deviceType: 1, // 设备类型
//                 extra: '', // 附件
//                 fitCar: '', // 适用车型
//                 freight: 0, // 运费
//                 materialName: '', // 物料名称
//                 num: null, // 数量
//                 originPlace: '', // 产地
//                 prices: [
//                     {
//                         price: null, // 售价
//                         priceName: '售价' // 价格名称
//                     }
//                 ],
//                 specification: '通用', // 规格
//                 status: 1, // 状态 0:下架 1：上架
//                 unit: '', // 单位
//                 warehouse: '' // 仓位
//             }
//         },
//         goonSave() {
//             this.save()
//             this.refresh()
//         },
//         showStyle(brandinfo) {
//             this.stylelist = []
//             let getData = {
//                 brandId: brandinfo.id
//             }
//             this.fittingInfo.brand = brandinfo.brandName
//             carApi.requestStyle.r(getData).then(res => {
//                 // this.stylelist = res.data;
//                 let factoryList = []
//                 res.data.forEach(item => {
//                     let index = factoryList.indexOf(item.factoryName)
//                     if (index < 0) {
//                         factoryList.push(item.factoryName)
//                         this.stylelist.push({
//                             initial: item.factoryName,
//                             cells: [item]
//                         })
//                     } else {
//                         this.stylelist[index].cells.push(item)
//                     }
//                 })
//             })
//             this.popupVisibleStyle = true
//         },
//         selectStyle(item) {
//             this.fittingInfo.carSeries = item.styleName
//             this.popupVisibleStyle = false
//             this.popupVisibleBrand = false
//         },
//         showprices() {
//             this.newPrices = []
//             this.fittingInfo.prices.forEach(element => {
//                 this.newPrices.push(element)
//             })
//             this.popupVisiblePrices = true
//         },
//         addNewPrice() {
//             let last = this.newPrices[this.newPrices.length - 1]

//             if (last.priceName !== '' && last.price > 0 && last.price !== null) {
//                 let newprice = {
//                     priceName: '',
//                     price: null
//                 }
//                 this.newPrices.push(newprice)
//             } else {
//                 this.toastVisibleDesc = true
//                 setTimeout(() => {
//                     this.toastVisibleDesc = false
//                 }, 5000)
//             }
//         },
//         // 删除指定价格
//         removeNewPrice(index) {
//             this.newPrices.splice(index, 1)
//         },
//         deletePrice(index) {
//             this.fittingInfo.prices.splice(index, 1)
//         },
//         savePrices() {
//             let last = this.newPrices[this.newPrices.length - 1]
//             if (last.priceName !== '' && last.price > 0 && last.price !== null) {
//                 this.fittingInfo.prices = []
//                 this.newPrices.forEach(element => {
//                     let price = {
//                         price: element.price, // 售价
//                         priceName: element.priceName // 价格名称
//                     }
//                     this.fittingInfo.prices.push(price)
//                 })
//                 this.popupVisiblePrices = false
//             } else {
//                 this.toastVisibleDesc = true
//                 setTimeout(() => {
//                     this.toastVisibleDesc = false
//                 }, 5000)
//             }
//         }
//     }
// }
</script>
<style>
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
