<template>
    <grid :cols="3">
        <grid-item label="开单报价">
            <i slot="icon"></i>
        </grid-item>
        <grid-item label="待审批">
            <i slot="icon"></i>
        </grid-item>
        <grid-item label="待施工">
            <i slot="icon"></i>
        </grid-item>
        <grid-item label="待质检">
            <i slot="icon"></i>
        </grid-item>
    </grid>
</template>
<script>
import { Grid, GridItem } from '@/components/grid';
export default {
    components: {
        Grid,
        GridItem
    }
};
</script>

<style>

</style>
