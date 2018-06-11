<template>
    <div style="height: 100%">
        <!-- <mt-header fixed :title="title">
            <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left">
                <mt-button icon="back" v-if="count" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header> -->
        <div class="main-content">
            <router-view />
        </div>
        <mt-tabbar fixed v-model="selected">
            <template v-for="(v, i) in menus">
                <mt-tab-item v-if="v.meta.show === undefined || v.meta.show !== false" :id="v.name" :key="i" @click.native="handleSelected(v)">
                    <div solt="icon" style="margin-bottom: 5px;">
                        <i class="fa" :class="v.meta.icon" style="font-size: 24px;"></i>
                    </div>
                    {{v.meta.name}}
                </mt-tab-item>
            </template>
        </mt-tabbar>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selected: '',
            menus: [],
            title: '',
            prevPath: '',
            count: 0
        }
    },
    methods: {
        handleSelected(item) {
            this.$router.push({ name: item.name })
            this.title = item.meta.name
        }
    },
    created() {
        this.menus = this.$parent.menuData
        console.log('tab', this.menus)
        this.selected = this.menus[1].name
        this.title = this.menus[1].meta.name
    },
    watch: {
        $route() {
            // if (this.$route.path === '/mobile/business-manage' || this.$route.path === '/mobile') {
            //     this.count = 0;
            // } else {
            //     this.count++;
            // }
            this.title = this.$route.meta.name
        }
    }
}
</script>

<style>
.main-content {
    position: absolute;
    top: 40px;
    bottom: 55px;
    left: 0;
    right: 0;
    height: auto;
    overflow: scroll;
}
</style>
