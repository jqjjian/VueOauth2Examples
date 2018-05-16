<template>
    <div>
        <mt-header fixed title="财务管理">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="container-box scroll">
            <mt-navbar v-model="selected" style="margin-bottom:10px;">
                <mt-tab-item id="1">待结账</mt-tab-item>
                <mt-tab-item id="2">已结账</mt-tab-item>
            </mt-navbar>

            <!-- tab-container -->
            <mt-tab-container v-model="selected" class="fitting-container">
                <mt-tab-container-item id="1">
                    <collection v-if="selected == 1"></collection>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <paid v-if="selected == 2"></paid>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
    </div>
</template>
<script>
import collection from './collection';
import paid from './paid';

export default {
    components: {
        collection,
        paid
    },
    data() {
        return {
            selected: '1'
        };
    }
};
</script>
<style>
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
