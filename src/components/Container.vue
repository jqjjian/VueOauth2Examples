<template>
    <router-view />
</template>

<script>
export default {
    name: 'Container',
    menus: [],
    created () {
        this.menus = this.$parent.menus;
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
