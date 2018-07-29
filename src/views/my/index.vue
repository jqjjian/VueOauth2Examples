<template>
    <div>
        <mt-header fixed :title="title">
            <!-- <router-link v-if="prevPath !== '/mobile'" :to="prevPath" slot="left">
                <mt-button icon="back" v-if="count" slot="left" @click.native="$router.back(-1)">返回</mt-button>
            </router-link> -->
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="scroll">
            <mt-cell :title="loginUser.username" :label="`修理厂：${loginUser.shops[0].name}`" class="my-name">
                <img slot="icon" src="" width="24" height="24" style="background: #ccc">
            </mt-cell>
            <div class="page-part subBtn">
                <mt-button size="large" type="default" @click="logout">退出登录</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
import { oauthApi } from '@/api'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            menus: [],
            title: ''
        }
    },
    computed: {
        ...mapGetters('oauth', ['loginUser'])
    },
    methods: {
        async logout() {
            try {
                await this.$message({
                    title: '提示',
                    message: '是否确定退出?',
                    showCancelButton: true
                })
                // if (result === 'confirm') {
                await oauthApi.clearToken.r()
                // 清除缓存session
                console.log(sessionStorage)
                sessionStorage.setItem('token', '')
                console.log(sessionStorage)
                sessionStorage.removeItem('token')
                console.log(sessionStorage)
                sessionStorage.clear()
                console.log(sessionStorage)
                // window.location.href = window.gloable.loginUrl
                window.location.href =
                    process.env.NODE_ENV === 'development' ? 'http://localhost:8081/' : window.gloable.localUrl
                // this.$router.replace({ name: 'login' })
                // }
            } catch (err) {
                console.error(err)
            }
        }
    },
    created() {
        this.title = this.$route.meta.name
    }
}
</script>

<style lang="postcss">
.my-name {
    background: #26a2ff;
    color: #fff;
    .mint-cell-wrapper {
        background-size: 120% 0;
    }
    .mint-cell-label {
        color: #ddd;
    }
}
.subBtn {
    margin-top: 30px;
}
</style>
