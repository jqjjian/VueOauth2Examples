<template>
    <div style="background: #fafafa;">
        <div style="padding-top:40px;padding-bottom:53px; backgroung: #000">
            <div style="margin-bottom: 10px;">
                <mt-field label="条形码" placeholder="扫一扫" v-model="fittingInfo.barCode"></mt-field>
                <mt-field class="tcth-field-required" label="设备名称" placeholder="请输入材料名称" v-model="fittingInfo.materialName"></mt-field>
                <mt-field label="单位" placeholder="请输入单位" v-model="fittingInfo.unit"></mt-field>
            </div>
            <div style="margin-bottom: 10px;">
                <mt-radio title="请选择设备类型" v-model="fittingInfo.deviceType" :options="options"></mt-radio>
            </div>
            <label class="mint-radiolist-title">添加附件</label>
            <div style="margin-bottom: 29px;">
                <!-- <mt-field v-for="(item,index) in extralist" :key="index" :label="'附件'+(index+1)" :placeholder="item" :disabled="true" type="number">
                    <mt-button size="small" v-if="index == 0" @click="showextra()">编辑</mt-button>
                    <mt-button size="small" v-else @click="deleteExtra(index)">删除</mt-button>
                </mt-field> -->
                <mt-field v-for="(item,index) in extralist" :key="index" :label="'附件'+(index+1)" v-model="extralist[index]" placeholder="请输入附件">
                    <mt-button size="small" v-if="index == extralist.length - 1 && extralist[index]!=''" @click="addextra()">新增</mt-button>
                    <mt-button size="small" v-if="index != 0" @click="deleteextra(index)">删除</mt-button>
                </mt-field>
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
        <!-- 价格管理 -->
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
        <!-- 附件管理 -->
        <mt-popup v-model="popupVisibleExtra" position="right" class="mint-popup-car" :modal="false" popup-transition="popup-fade" style="background:#fafafa">
            <div style="height: 100%;overflow-y: scroll;">
                <mt-header title="新增附件" style="position: fixed;width: 100%;z-index: 100;top: 0;">
                    <mt-button slot="left" @click="popupVisibleExtra = false">取消</mt-button>
                    <mt-button slot="right" @click="addNewExtra()">添加</mt-button>
                </mt-header>
                <div style="height:40px"></div>
                <div v-for="(item,index) in newExtra" :key="index" style="margin-bottom:10px">
                    <mt-field :label="'附件'+(index+1)" placeholder="请输入价格名称" v-model="newExtra[index]">
                        <mt-button v-if="index!=0" size="small" @click="removeNewExtra(index)">删除</mt-button>
                    </mt-field>
                </div>
                <div class="tcth-danger-desc" v-if="toastVisibleDesc">请输入完整的配件信息</div>
                <div style="text-align: center;padding:20px 0;">
                    <mt-button type="danger" style="width:80%" @click="saveExtra()">保存</mt-button>
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
            popupVisibleBrand: false,
            popupVisibleStyle: false,
            popupVisiblePrices: false,
            popupVisibleExtra: false,
            toastVisibleDesc: false,
            popFormRules: {
                materialName: {
                    required: true,
                    message: '设备名不能为空',
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
                    message: '价格不能为空',
                    error: false
                }
            },
            options: [{ label: '原厂', value: '1' }, { label: '通用', value: '2' }],
            newPrices: [],
            extralist: [''],
            newExtra: []
        }
    },
    components: {
        MessageBox,
        Toast
    },
    props: ['fittingInfo', 'isEdit'],
    created() {
        console.log(this.fittingInfo)
        let info = this.$route.params.fittingInfo
        if (info) {
            this.isEdit = true
            this.fittingInfo.deviceType = this.fittingInfo.deviceType.toString()
            this.extralist = info.extra !== '' ? JSON.parse(info.extra) : ['']
        } else {
            this.fittingInfo.prices[0].priceName = '租用价/次'
        }
    },
    methods: {
        requiredData() {
            let result = true
            if (this.fittingInfo.materialName === '') {
                result = false
            }
            if (!this.isEdit) {
                if (this.fittingInfo.buyingPrice === null || this.fittingInfo.buyingPrice === '') {
                    result = false
                }
            }
            if (!this.isEdit) {
                if (this.fittingInfo.num === null || this.fittingInfo.num === '') {
                    result = false
                }
            }
            this.fittingInfo.prices.forEach(element => {
                if (element.price === null || element.price === '') {
                    result = false
                }
            })
            return result
        },
        edit() {
            if (this.requiredData()) {
                this.fittingInfo.extra = JSON.stringify(this.extralist)
                fittingApi.saveFitting.r(this.fittingInfo).then(response => {
                    if (response.status === 200) {
                        Toast({
                            message: '修改成功',
                            duration: 3000
                        })
                        this.$router.go(-1)
                    } else {
                        Toast({
                            message: '修改失败',
                            duration: 3000
                        })
                    }
                })
            } else {
                Toast('请输入红色字体必填项')
            }
        },
        save() {
            if (this.requiredData()) {
                this.fittingInfo.classifyId = '3'
                this.fittingInfo.extra = JSON.stringify(this.extralist)
                fittingApi.saveFitting.r(this.fittingInfo).then(response => {
                    if (response.status === 200) {
                        Toast({
                            message: '入库成功',
                            duration: 3000
                        })
                    } else {
                        Toast({
                            message: '修改失败',
                            duration: 3000
                        })
                    }
                })
            } else {
                Toast('请输入红色字体必填项')
            }
        },
        refresh() {
            this.fittingInfo = {
                barCode: '', // 条形码
                brand: '', // 品牌
                buyingPrice: null, // 采购价
                carSeries: '', // 车型系列
                classifyId: 1, // 所属配件分类
                code: '', // 编码
                deviceType: '1', // 设备类型
                extra: '', // 附件
                fitCar: '', // 适用车型
                freight: 0, // 运费
                materialName: '', // 物料名称
                num: null, // 数量
                originPlace: '', // 产地
                prices: [
                    {
                        price: null, // 售价
                        priceName: '租用价/次' // 价格名称
                    }
                ],
                specification: '通用', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            }
        },
        goonSave() {
            this.save()
            this.refresh()
        },
        showprices() {
            this.newPrices = []
            this.fittingInfo.prices.forEach(element => {
                this.newPrices.push(element)
            })
            this.popupVisiblePrices = true
        },
        showextra() {
            this.newExtra = []
            this.extralist.forEach(element => {
                this.newExtra.push(element)
            })
            this.popupVisibleExtra = true
        },
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
        addNewExtra() {
            let last = this.newExtra[this.newExtra.length - 1]
            if (last !== '' && last !== null) {
                this.newExtra.push('')
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
        // 删除配件
        removeNewExtra(index) {
            this.newExtra.splice(index, 1)
        },
        deletePrice(index) {
            this.fittingInfo.prices.splice(index, 1)
        },
        deleteExtra(index) {
            this.extralist.splice(index, 1)
            this.fittingInfo.extra = JSON.stringify(this.extralist)
        },
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
        },
        saveExtra() {
            let last = this.newExtra[this.newExtra.length - 1]
            if (last !== '' && last !== null) {
                this.extralist = this.newExtra
                this.fittingInfo.extra = JSON.stringify(this.newExtra)
                this.popupVisibleExtra = false
            } else {
                this.toastVisibleDesc = true
                setTimeout(() => {
                    this.toastVisibleDesc = false
                }, 5000)
            }
        },
        addextra() {
            this.extralist.push('')
        },
        deleteextra(index) {
            this.extralist.splice(index, 1)
            console.log(this.extralist)
        }
    }
}
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
