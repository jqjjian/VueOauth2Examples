<template>
    <div>
        <mt-header fixed :title="title">
            <mt-button icon="back" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            <!-- <router-link :to="{name: 'order-price-item'}" slot="right">
                <mt-button >开单</mt-button>
            </router-link> -->
        </mt-header>
        <div style="margin-top: 50px;">
            正在建设中...
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            title: ''
        }
    },
    created() {
        this.title = this.$route.meta.name
    },
    watch: {
        $route() {
            this.title = this.$route.meta.name
        }
    }
}
</script>

<style>
</style>
