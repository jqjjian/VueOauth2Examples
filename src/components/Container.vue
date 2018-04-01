<template>
    <router-view />
</template>

<script>
export default {
    name: 'Container',
    // menus: [],
    menuData: [],
    created () {
        // this.menus = this.$parent.menus;
        this.menuData = this.$parent.menuData;
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
