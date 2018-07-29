<template>
    <div>

        <div style="padding-top:40px;padding-bottom:53px; backgroung: #000">
            <div style="margin-bottom: 10px;">
                <mt-field class="tcth-field-required" label="条形码" placeholder="扫一扫" v-model="fittingInfo.barCode"></mt-field>
                <mt-field class="tcth-field-required" label="配件名称" placeholder="请输入材料名称" v-model="fittingInfo.materialName"></mt-field>
                <mt-field label="适用车型" placeholder="请输入适用车型" v-model="fittingInfo.fitCar"></mt-field>
                <mt-field label="单位" placeholder="请输入单位" v-model="fittingInfo.unit"></mt-field>
                <mt-field label="产地" placeholder="请输入产地" v-model="fittingInfo.originPlace"></mt-field>
            </div>
            <div style="margin-bottom: 29px;">
                <mt-radio title="请选择规格" v-model="fittingInfo.specification" :options="options"></mt-radio>
            </div>
            <div>
                <mt-field label="仓位" placeholder="请输入仓位" v-model="fittingInfo.warehouse"></mt-field>
                <mt-field v-if="!isEdit" class="tcth-field-required" label="采购价" placeholder="请输入采购价" type="number" v-model="fittingInfo.buyingPrice"></mt-field>
                <mt-field v-if="!isEdit" class="tcth-field-required" label="数量" placeholder="请输入数量" type="number" v-model="fittingInfo.num"></mt-field>
                <mt-field label="运费" placeholder="请输入运费" type="number" v-model="fittingInfo.freight"></mt-field>
                <mt-field class="tcth-field-required" v-for="(item,index) in fittingInfo.prices" :key="index" :label="item.priceName" placeholder="请编辑价格信息" :disabled="true" type="number" v-model="item.price">
                    <mt-button size="small" v-if="index == 0" @click="showprices()">编辑</mt-button>
                    <mt-button size="small" v-else @click="deletePrice(index)">删除</mt-button>
                </mt-field>
            </div>
        </div>
        <div v-if="isEdit" style="position: fixed;bottom: 0;background: rgba(0,0,0,0.5);width: 100%;padding: 10px;">
            <mt-button size="small" @click="edit()">保存</mt-button>
        </div>
        <div v-else style="position: fixed;bottom: 0;background: rgba(0,0,0,0.5);width: 100%;padding: 10px;">
            <mt-button size="small" @click="refresh()">重置</mt-button>
            <mt-button size="small" @click="save()">入库</mt-button>
            <mt-button size="small" @click="goonSave()">继续入库</mt-button>
        </div>
        <mt-popup v-model="popupVisiblePrices" position="right" class="mint-popup-car" :modal="false" popup-transition="popup-fade" style="background:#fafafa">
            <div style="height: 100%;overflow-y: scroll;">
                <mt-header title="新增价格" style="position: fixed;width: 100%;z-index: 100;top: 0;">
                    <mt-button slot="left" @click="popupVisiblePrices = false">取消</mt-button>
                    <mt-button slot="right" @click="addNewPrice()">添加</mt-button>
                </mt-header>
                <div style="height:40px"></div>
                <div v-for="(item,index) in newPrices" :key="index" style="margin-bottom:10px">
                    <mt-field label="价格名称" placeholder="请输入价格名称" v-model="item.priceName" :readonly="index==0">
                        <mt-button v-if="index!=0" size="small" @click="removeNewPrice(index)">删除</mt-button>
                    </mt-field>
                    <mt-field label="金额" placeholder="请输入金额" type="number" v-model="item.price"></mt-field>
                </div>
                <div class="tcth-danger-desc" v-if="toastVisibleDesc">请输入完整的价格信息</div>
                <div style="text-align: center;padding:20px 0;">
                    <mt-button type="danger" style="width:80%" @click="savePrices()">保存</mt-button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui'
import { fittingApi } from '@/api'
export default {
    data() {
        return {
            popupVisiblePrices: false,
            toastVisibleDesc: false,
            value: '通用',
            selected: '1',
            fittingInfo: {
                barCode: '', // 条形码
                brand: '', // 品牌
                buyingPrice: null, // 采购价
                carSeries: '', // 车型系列
                classifyId: 1, // 所属配件分类
                code: '', // 编码
                deviceType: 1, // 设备类型
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
            },
            popFormRules: {
                barCode: {
                    required: true,
                    message: '条形码不能为空',
                    error: false
                },
                materialName: {
                    required: true,
                    message: '配件名不能为空',
                    error: false
                },
                carSeries: {
                    required: true,
                    message: '请选择适用车型',
                    error: false
                },
                buyingPrice: {
                    required: true,
                    message: '采购价不能为空',
                    error: false
                },
                num: {
                    required: true,
                    message: '数量不能为空',
                    error: false
                },
                price: {
                    required: true,
                    message: '售价不能为空',
                    error: false
                }
            },
            options: [
                {
                    label: '通用',
                    value: '通用'
                },
                {
                    label: '左(L)',
                    value: '左(L)'
                },
                {
                    label: '右(R)',
                    value: '右(R)'
                }
            ],
            newPrices: [],
            isEdit: false
        }
    },
    components: {
        MessageBox,
        Toast
    },
    created() {
        console.log('来自组件: ', this.$route.params)
        if (this.$route.params.fittingInfo) {
            this.isEdit = true
            this.fittingInfo = this.$route.params.fittingInfo
        }
    },
    methods: {
        // 必填判断
        requiredData() {
            let f = this.fittingInfo
            let result = true

            if (f.materialName === '') {
                result = false
            }
            if (f.carSeries === '') {
                result = false
            }
            if (!this.isEdit) {
                if (f.buyingPrice === null || f.buyingPrice === '') {
                    result = false
                }
            }
            if (!this.isEdit) {
                if (f.num === null || f.num === '') {
                    result = false
                }
            }
            f.prices.forEach(element => {
                if (element.price === null || element.price === '') {
                    result = false
                }
            })
            return result
        },
        // 修改保存
        edit() {
            if (this.requiredData()) {
                fittingApi.saveFitting.r(this.fittingInfo).then(response => {
                    Toast({
                        message: '修改成功',
                        duration: 3000
                    })
                })
            } else {
                Toast('请输入红色字体必填项')
            }
        },
        // 新增保存
        save() {
            if (this.requiredData()) {
                fittingApi.saveFitting.r(this.fittingInfo).then(response => {
                    if (response.status === 200) {
                        Toast({
                            message: '入库成功',
                            duration: 3000
                        })
                        this.$router.go(-1)
                    } else {
                        Toast({
                            message: response.message,
                            duration: 3000
                        })
                    }
                })
            } else {
                Toast('请输入红色字体必填项')
            }
        },
        // 清空
        refresh() {
            this.fittingInfo = {
                barCode: '', // 条形码
                brand: '', // 品牌
                buyingPrice: null, // 采购价
                carSeries: '', // 车型系列
                classifyId: 1, // 所属配件分类
                code: '', // 编码
                deviceType: 1, // 设备类型
                extra: '', // 附件
                fitCar: '', // 适用车型
                freight: 0, // 运费
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
        },
        // 继续入库
        goonSave() {
            this.save()
            this.refresh()
        },
        // 编辑价格
        showprices() {
            this.newPrices = []
            this.fittingInfo.prices.forEach(element => {
                this.newPrices.push(element)
            })
            this.popupVisiblePrices = true
        },
        // 新增价格
        addNewPrice() {
            let last = this.newPrices[this.newPrices.length - 1]

            if (last.priceName !== '' && last.price > 0 && last.price !== null) {
                let newprice = {
                    priceName: '',
                    price: null
                }
                this.newPrices.push(newprice)
            } else {
                this.toastVisibleDesc = true
                setTimeout(() => {
                    this.toastVisibleDesc = false
                }, 5000)
            }
        },
        // 删除指定价格
        removeNewPrice(index) {
            this.newPrices.splice(index, 1)
        },
        // 删除价格
        deletePrice(index) {
            this.fittingInfo.prices.splice(index, 1)
        },
        // 保存价格
        savePrices() {
            let last = this.newPrices[this.newPrices.length - 1]
            if (last.priceName !== '' && last.price > 0 && last.price !== null) {
                this.fittingInfo.prices = []
                this.newPrices.forEach(element => {
                    let price = {
                        price: element.price, // 售价
                        priceName: element.priceName // 价格名称
                    }
                    this.fittingInfo.prices.push(price)
                })
                this.popupVisiblePrices = false
            } else {
                this.toastVisibleDesc = true
                setTimeout(() => {
                    this.toastVisibleDesc = false
                }, 5000)
            }
        }
    }
}
</script>
