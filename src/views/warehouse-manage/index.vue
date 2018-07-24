<template>
    <div>
        <mt-header fixed title="仓库管理">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="container-box scroll">
            <mt-navbar v-model="selected" @click.native="change(selected)" style="margin-bottom:10px;">
                <mt-tab-item id="1">配件</mt-tab-item>
                <mt-tab-item id="2">材料</mt-tab-item>
                <mt-tab-item id="3">设备</mt-tab-item>
            </mt-navbar>

            <!-- tab-container -->
            <mt-tab-container v-model="selected" class="fitting-container">
                <mt-tab-container-item id="1">
                    <fitting v-if="selected == '1'"></fitting>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <material v-if="selected == '2'"></material>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <equipment v-if="selected == '3'"></equipment>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
    </div>
</template>
<script>
import fitting from './fitting'
import material from './material'
import equipment from './equipment'
import store from '@/store'

export default {
    data() {
        return {
            // value: '搜索',
            selected: null
        }
    },
    components: {
        fitting,
        material,
        equipment
    },
    created() {
        this.selected = store.state.warehouseIndex
    },
    methods: {
        change(id) {
            store.commit('SET_WAREHOUSE_INDEX', id)
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
</style>
