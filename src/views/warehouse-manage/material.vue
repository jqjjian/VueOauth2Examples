<template>
    <div>
        <mt-cell-swipe v-for="(item,index) in materialist" :key="index" class="ycy-cell-swipe" :right="[
                {
                    content: '编辑',
                    style: { background: 'lightgray', color: '#fff' },
                    handler: () => editFn(item)
                },
                {
                    content: '删除',
                    style: { background: 'red', color: '#fff' },
                    handler: () => deleteFn(item.id)
                }
            ]">
            <slot name="value">
                <div class="tcth-cell">
                    <div style="width: 80px;margin-right:10px;">
                        <img src="../../assets/car.jpeg" alt="汽车图片" style="width: 100%">
                    </div>
                    <div class="materia-info">
                        <div>
                            <span class="materia-name" style="">{{item.materialName}}</span>
                            <span>{{item.code}}</span>
                        </div>
                        <div>
                            <span>{{item.specification}}</span>
                        </div>
                        <div>
                            <span>售价</span>
                            <span class="materia-price">￥{{item.prices[0].price}}</span>
                            <span>库存</span>
                            <span class="materia-num">{{item.num}}</span>
                        </div>
                    </div>
                </div>
            </slot>
        </mt-cell-swipe>

        <div class="cart">
            <mt-button size="small" @click="addNewFitting()">新增材料</mt-button>
        </div>
    </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui';
import { fittingApi } from '@/api';
export default {
    data() {
        return {
            msg: 'fitting',
            rightButton: [
                {
                    content: '编辑',
                    style: { background: 'lightgray', color: '#fff' },
                    handler: event => console.log(event)
                    // handler: () => this.edit()
                },
                {
                    content: '删除',
                    style: { background: 'red', color: '#fff' },
                    handler: () => this.$messagebox('delete')
                }
            ],
            materialist: []
        };
    },
    created() {
        this.getFittingList();
    },
    methods: {
        getFittingList() {
            fittingApi.inventoryFitting.r({ classifyId: 2 }).then(resp => {
                this.materialist = resp.data;
            });
        },
        editFn(val) {
            this.$router.push({
                name: 'fitting-info-item',
                params: { fittingInfo: val }
            });
        },
        deleteFn(id) {
            MessageBox.confirm('确认删除?')
                .then(action => {
                    fittingApi.deleteFitting.r({ id: id }).then(response => {
                        if (response.status === 200) {
                            Toast({
                                message: '删除成功',
                                duration: 1000
                            });
                            this.getFittingList();
                        } else {
                            Toast({
                                message: '删除失败! 原因: ' + response.message,
                                duration: 1000
                            });
                        }
                    });
                })
                .catch(() => {
                    alert('取消');
                });
        },
        addNewFitting() {
            this.$router.push({
                name: 'fitting-info-item'
            });
        }
    }
};
</script>
<style lang="postcss">
.ycy-cell-swipe .mint-cell-value {
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
    .materia-info {
        font-size: 0.8rem;
        color: #999;
        div + div {
            margin: 8px 0;
        }
    }
}
.materia-info {
    .materia-name {
        color: #000;
        font-size: 1rem;
    }
    .materia-price,
    .materia-num {
        color: orange;
        font-size: 1rem;
    }
    .materia-price {
        margin-right: 20px;
    }
}
</style>
