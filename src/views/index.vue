<template>
    <div style="height: 100%">
        <mt-header fixed :title="title">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="main-content">
            <router-view />
        </div>
        <mt-tabbar v-model="selected">
            <template v-for="(v, i) in menus">
                <mt-tab-item :id="v.name" :key="i" @click.native="handleSelected(v)">
                {{v.meta.name}}
                </mt-tab-item>
            </template>
        </mt-tabbar>
    </div>
</template>

<script>
export default {
    data () {
        return {
            selected: '',
            menus: [],
            title: ''
        };
    },
    methods: {
        handleSelected (item) {
            this.$router.push({name: item.name});
            this.title = item.meta.name;
        }
    },
    created () {
        this.menus = this.$parent.menuData;
        this.selected = this.menus[1].name;
        this.title = this.menus[1].meta.name;
    }
};
</script>

<style>
.main-content {
    position: absolute;
    top: 40px;
    bottom: 55px;
    left: 0;
    right: 0;
}
</style>
