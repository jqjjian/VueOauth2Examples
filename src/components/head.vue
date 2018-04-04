<template>
    <mt-header fixed :title="title">
        <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
        <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
            <mt-button >开单</mt-button>
        </router-link> -->
    </mt-header>
</template>

<script>
export default {
    data() {
        return {
            title: ''
        };
    },
    created () {
        this.handleQuery();
        this.title = this.$route.meta.name;
    }
};
</script>

<style>

</style>
