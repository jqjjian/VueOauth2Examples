<template>
    <grid :cols="3">
        <template v-for="(v, i) in menus">
            <grid-item :label="v.meta.name" :link="{name: `${v.name}-item`}" :key="i">
                <i class="" slot="icon"></i>
            </grid-item>
        </template>
    </grid>
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
            menus: []
        };
    },
    created () {
        console.log(this.$route);
        this.menus = this.$route.meta.children;
    }
};
</script>

<style>

</style>
