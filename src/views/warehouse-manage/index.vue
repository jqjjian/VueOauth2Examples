<template>
    <div>
        <mt-header fixed title="仓库管理">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="container-box scroll">
            <mt-navbar v-model="selected" style="margin-bottom:10px;">
                <mt-tab-item id="1">配件</mt-tab-item>
                <mt-tab-item id="2">材料</mt-tab-item>
                <mt-tab-item id="3">设备</mt-tab-item>
            </mt-navbar>

            <!-- tab-container -->
            <mt-tab-container v-model="selected" class="fitting-container">
                <mt-tab-container-item id="1">
                    <fitting></fitting>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <material></material>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <equipment></equipment>
                </mt-tab-container-item>
            </mt-tab-container>
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
            selected: '1'
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
    background: rgba(0,0,0,0.6);;
    padding: 5px;
    width: 100%;
    /* height: 40px; */
    line-height: 40px;
}
</style>
