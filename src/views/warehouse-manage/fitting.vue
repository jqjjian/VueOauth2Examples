<template>
    <div>
        <mt-cell-swipe class="ycy-cell-swipe" :right="rightButton" v-for="(item,index) in fittinglist" :key="index">
            <slot name="value">
                <div class="tcth-cell">
                    <div style="width: 80px;margin-right:10px;">
                        <img src="../../assets/car.jpeg" alt="汽车图片" style="width: 100%">
                    </div>
                    <div class="fitting-info">
                        <div>
                            <span class="fitting-name" style="">{{item.materialName}}</span>
                            <span>{{item.code}}</span>
                        </div>
                        <div>
                            <span>{{item.specification}}</span>
                        </div>
                        <div>
                            <span>售价</span>
                            <span class="fitting-price">￥{{item.prices[0].price}}</span>
                            <span>库存</span>
                            <span class="fitting-num">{{item.num}}</span>
                        </div>
                    </div>
                </div>
            </slot>
        </mt-cell-swipe>
        <!-- <div class="tcth-cell" v-for="i in 10" :key="i">
            <div style="width: 80px;margin-right:10px;">
                <img src="../../assets/car.jpeg" alt="汽车图片" style="width: 100%">
            </div>
            <div class="fitting-info">
                <div>
                    <span class="fitting-name" style="">配件名</span>
                    <span>配件编码</span>
                </div>
                <div>
                    <span>属性</span>
                    <span>属性</span>
                    <span>属性</span>
                </div>
                <div>
                    <span>售价</span>
                    <span class="fitting-price">100.00</span>
                    <span>库存</span>
                    <span class="fitting-num">10</span>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import { fittingApi } from '@/api';
export default {
    data() {
        return {
            msg: 'fitting',
            rightButton: [
                {
                    content: '编辑',
                    style: { background: '#eee' },
                    handler: () => this.$messagebox('delete')
                },
                {
                    content: '删除',
                    style: { background: 'red', color: '#fff' },
                    handler: () => this.$messagebox('delete')
                }
            ],
            fittinglist: []
        };
    },
    created() {
        fittingApi.inventoryFitting.r({ classifyId: 1 }).then(resp => {
            console.log(resp);
            this.fittinglist = resp.data;
        });
    }
};
</script>
<style lang="postcss">
.ycy-cell-swipe,
.mint-cell-value {
    // display: block !import;
    width: 100%;
}
.tcth-cell {
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // min-height: 48px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    border-bottom: 1px solid #eeeeee;
    padding: 10px;
    display: flex;
    width: 100%;
    .fitting-info {
        font-size: 0.8rem;
        color: #999;
        div + div {
            margin: 8px 0;
        }
    }
}
.fitting-info {
    .fitting-name {
        color: #000;
        font-size: 1rem;
    }
    .fitting-price,
    .fitting-num {
        color: orange;
        font-size: 1rem;
    }
    .fitting-price{
        margin-right: 20px
    }
}
</style>
