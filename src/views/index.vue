<template>
    <div>
        <mt-header fixed title="">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="外卖">
                外卖
            </mt-tab-item>
            <mt-tab-item id="订单">
                订单
            </mt-tab-item>
            <mt-tab-item id="发现">
                发现
            </mt-tab-item>
            <mt-tab-item id="我的">
                我的
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
export default {
    data () {
        return {
            selected: '外卖'
        };
    }
};
</script>

<style>

</style>
