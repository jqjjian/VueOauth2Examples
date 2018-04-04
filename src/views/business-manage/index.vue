<template>
    <div>
        <mt-header fixed :title="title">
            <!-- <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left">
                <mt-button icon="back" v-if="count" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            </router-link> -->
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <grid :cols="3">
            <template v-for="(v, i) in menus">
                <grid-item v-if="!v.meta.hide" :label="v.meta.name" :link="{name: `${v.name}-item`}" :key="i">
                    <i class="" slot="icon"></i>
                </grid-item>
            </template>
        </grid>
    </div>
</template>
<script>
import { Grid, GridItem } from '@/components/grid';
export default {
    components: {
        Grid,
        GridItem
    },
    data () {
        return {
            menus: [],
            title: ''
        };
    },
    created () {
        this.menus = this.$route.meta.children;
        this.title = this.$route.meta.name;
    }
    // watch: {
    //     $route () {
    //         // if (this.$route.path === '/mobile/business-manage' || this.$route.path === '/mobile') {
    //         //     this.count = 0;
    //         // } else {
    //         //     this.count++;
    //         // }
    //         this.title = this.$route.meta.name;
    //     }
    // }
};
</script>

<style>

</style>
