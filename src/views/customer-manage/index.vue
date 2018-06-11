<template>
    <div>
        <mt-header fixed :title="title">
            <!-- <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left">
                <mt-button icon="back" v-if="count" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            </router-link> -->
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div> 正在建设中...</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            menus: [],
            title: ''
        };
    },
    created () {
        this.title = this.$route.meta.name;
    }
}
</script>

<style>
</style>
