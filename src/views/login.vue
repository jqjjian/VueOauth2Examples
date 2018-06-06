<template>
    <div class="wrap" @keyup.enter="login">
        <mt-popup class="popup" popup-transition="popup-fade" position="top" :model="popupVisible">
            <div>{{text}}</div>
        </mt-popup>
        <mt-header fixed title="系统登录">
            <div slot="left">
                <!-- <mt-button v-link="'/'" icon="back">返回</mt-button> -->
                <mt-button @click="handleClose">关闭</mt-button>
            </div>
        </mt-header>
        <div class="login-form">
            <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
            <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
            <mt-button class="btn" size="large" type="primary" @click.native="login">登录</mt-button>
        </div>
    </div>
</template>

<script>
import { oauthApi } from '@/api';
import { session } from '@/util';
export default {
    data () {
        return {
            popupVisible: false,
            text: '',
            username: '',
            password: ''
        };
    },
    methods: {
        handleClose () {
            console.log('关闭');
        },
        async login () {
            const vm = this;
            if (!vm.username) {
                vm.popupVisible = true;
                vm.text = '请输入用户名';
                return false;
            }
            if (!vm.password) {
                vm.popupVisible = true;
                vm.text = '请输入密码';
                return false;
            }
            const loginParams = {
                username: vm.username,
                password: vm.password,
                client_id: '75c666ad-752b-48be-b76a-aca75776eec3',
                client_secret: 'aa6f3fd6-35ff-46da-a70b-2e73ab83ba1e',
                grant_type: 'password'
            };
            try {
                const res = await oauthApi.getToken.r(loginParams);
                if (res.access_token) {
                    session('token', res);
                    vm.$emit('login', vm.$router.currentRoute.query.from);
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    watch: {
        popupVisible(val) {
            if (val) {
                setTimeout(() => {
                    this.popupVisible = false;
                }, 2000);
            }
        }
    },
    created() {
        sessionStorage.clear();
    }
};
</script>

<style lang="postcss">
.wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    .login-form {
        padding: 0 20px;
        margin-top: 30vh;
        width: 100%;
        .mint-cell {
            margin: 0 -10px;
        }
    }
    .popup {
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #fff;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.6);
        backface-visibility: hidden;
    }
}
</style>
