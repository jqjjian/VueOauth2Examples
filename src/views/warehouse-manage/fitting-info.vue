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
                <mt-field class="tcth-field" label="材料名称" placeholder="请输入材料名称" v-model="fittingInfo.materialName"></mt-field>
                <!-- <mt-field label="规格" placeholder="请输入规格" v-model="fittingInfo.barCode"></mt-field> -->
                <mt-field class="tcth-field" label="适用车型" placeholder="请选择适用车型" :value="fittingInfo.brand + ' ' + fittingInfo.carSeries" :readonly="true">
                    <mt-button size="small" @click="popupVisibleBrand=true">选择</mt-button>
                </mt-field>
                <mt-field label="单位" placeholder="请输入单位" v-model="fittingInfo.unit"></mt-field>
                <mt-field label="产地" placeholder="请输入产地" v-model="fittingInfo.originPlace"></mt-field>
            </div>
            <div style="margin-bottom: 29px;">
                <mt-radio title="请选择规格" v-model="fittingInfo.specification" :options="options">
                </mt-radio>
            </div>
            <div>
                <mt-field label="仓位" placeholder="请输入仓位" v-model="fittingInfo.warehouse"></mt-field>
                <mt-field class="tcth-field" label="采购价" placeholder="请输入采购价" type="number" v-model="fittingInfo.buyingPrice"></mt-field>
                <mt-field class="tcth-field" label="数量" placeholder="请输入数量" type="number" v-model="fittingInfo.num"></mt-field>
                <mt-field label="运费" placeholder="请输入运费" type="number" v-model="fittingInfo.freight"></mt-field>
                <mt-field class="tcth-field" v-for="(item,index) in fittingInfo.prices" :key="index" :label="item.priceName" placeholder="请输入售价" type="number" v-model="item.price">
                    <mt-button size="small" v-if="index == 0" @click="showprices()">新增</mt-button>
                    <mt-button size="small" v-else @click="deletePrice()">删除</mt-button>
                </mt-field>
            </div>
        </div>
        <div style="position: fixed;bottom: 0;background: rgba(0,0,0,0.5);width: 100%;padding: 10px;">
            <mt-button size="small" @click="refresh()">重置</mt-button>
            <mt-button size="small" @click="save()">入库</mt-button>
            <mt-button size="small">继续入库</mt-button>
        </div>
        <mt-popup v-model="popupVisibleBrand" position="right" class="mint-popup-car" :modal="false" popup-transition="popup-fade">
            <mt-header fixed title="选择适用车型">
                <mt-button slot="left" @click="popupVisibleBrand = false">关闭</mt-button>
            </mt-header>
            <mt-index-list style="margin-top:40px;">
                <mt-index-section v-for="(item,index) in brandlist" :key="index" :index="item.initial">
                    <mt-cell v-for="(item2,index2) in item.cells" :key="index2" :title="item2.brandName" is-link @click.native="showStyle(item2)"></mt-cell>
                </mt-index-section>
            </mt-index-list>
        </mt-popup>
        <mt-popup v-model="popupVisibleStyle" position="right" class="mint-popup-style" :modal="true" popup-transition="popup-fade">
            <mt-index-list class="style-indexlist" :show-indicator="false">
                <mt-index-section v-for="(item,index) in stylelist" :key="index" :index="item.initial">
                    <mt-cell v-for="(item2,index2) in item.cells" :key="index2" :title="item2.styleName" @click.native="selectStyle(item2)"></mt-cell>
                </mt-index-section>
            </mt-index-list>
        </mt-popup>
        <mt-popup v-model="popupVisiblePrices" position="right" class="mint-popup-car" :modal="false" popup-transition="popup-fade" style="background:#fafafa">
            <div style="height: 100%;overflow-y: scroll;">
                <mt-header title="新增价格" style="position: fixed;width: 100%;z-index: 100;top: 0;">
                    <mt-button slot="left" @click="popupVisiblePrices = false">取消</mt-button>
                    <mt-button slot="right" @click="addNewPrice()">添加</mt-button>
                </mt-header>
                <div style="height:40px"></div>
                <div v-for="(item,index) in newPrices" :key="index" style="margin-bottom:10px">
                    <mt-field label="价格名称" placeholder="请输入价格名称" v-model="item.priceName">
                        <mt-button v-if="index!=0" size="small" @click="removePrice(index)">删除</mt-button>
                    </mt-field>
                    <mt-field label="金额" placeholder="请输入金额" type="number" v-model="item.price"></mt-field>
                </div>
                <div style="text-align: center;padding:20px 0;">
                    <mt-button type="danger" style="width:80%" @click="savePrices()">保存</mt-button>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { fittingApi, carApi } from '@/api';
// import * as R from 'ramda';

export default {
    data() {
        return {
            popupVisibleBrand: false,
            popupVisibleStyle: false,
            popupVisiblePrices: false,
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
                specification: '', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            },
            options: [
                {
                    label: '通用',
                    value: '通用'
                },
                {
                    label: '左(L)',
                    value: 'L'
                },
                {
                    label: '右(R)',
                    value: 'R'
                }
            ],
            brandlist: [],
            stylelist: [],
            newPrices: []
        };
    },
    components: {
        MessageBox
    },
    created() {
        this.getCarBrand();
    },
    methods: {
        aaa() {
            alert(1);
        },
        getCarBrand() {
            carApi.requestBrand.r().then(res => {
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(initial => {
                    let cells = res.data.filter(brand => brand.firstLetter === initial);
                    if (cells.length > 0) {
                        this.brandlist.push({
                            initial,
                            cells
                        });
                    }
                });
            });
        },
        save() {
            fittingApi.saveFitting.r(this.fittingInfo).then(response => {
                console.log(response);
            });
        },
        addNewPrice() {
            // this.newPrices = this.fittingInfo.prices;
            let newprice = {
                priceName: '',
                price: null
            };
            this.newPrices.push(newprice);
        },
        deletePrice() {},
        refresh() {
            this.fittingInfo = {
                barCode: '', // 条形码
                brand: '11', // 品牌
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
                specification: '', // 规格
                status: 1, // 状态 0:下架 1：上架
                unit: '', // 单位
                warehouse: '' // 仓位
            };
        },
        showStyle(brandinfo) {
            this.stylelist = [];
            let getData = {
                brandId: brandinfo.id
            };
            this.fittingInfo.brand = brandinfo.brandName;
            carApi.requestStyle.r(getData).then(res => {
                // this.stylelist = res.data;
                let factoryList = [];
                res.data.forEach(item => {
                    let index = factoryList.indexOf(item.factoryName);
                    if (index < 0) {
                        factoryList.push(item.factoryName);
                        this.stylelist.push({
                            initial: item.factoryName,
                            cells: [item]
                        });
                    } else {
                        this.stylelist[index].cells.push(item);
                    }
                });
            });
            this.popupVisibleStyle = true;
        },
        selectStyle(item) {
            this.fittingInfo.carSeries = item.styleName;
            console.log(this.fittingInfo);
            this.popupVisibleStyle = false;
            this.popupVisibleBrand = false;
        },
        showprices() {
            this.newPrices = [
                {
                    priceName: '',
                    price: null
                }
            ];
            this.popupVisiblePrices = true;
        },
        // 删除指定价格
        removePrice(index) {
            this.newPrices.splice(index, 1);
        },
        savePrices() {
            this.newPrices.forEach(element => {
                let price = {
                    price: element,price, // 售价
                    priceName: element.priceName // 价格名称
                };
                this.fittingInfo.prices.push(price);
            });
        }
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
.tcth-field .mint-cell-text {
    color: red;
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
</style>
