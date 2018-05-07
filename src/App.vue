<template>
    <div>
        <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
    </div>
</template>

<script>
import Vue from 'vue';
import { session, catchError, buildMenu } from '@/util';
import { intercept, oauthApi } from '@/api';
import { mapActions } from 'vuex';
import oauthconfig from '@/config';
import userPath from '@/router/fullpath';
import * as R from 'ramda';
export default {
    name: 'App',
    data () {
        return {
            popupVisible: false,
            myInterceptor: null,
            menuData: [],
            userData: []
        };
    },
    methods: {
        ...mapActions('oauth', [
            'getUserByToken',
            'initializeUser'
        ]),
        storageMenu (allowedRouter) {
            // allowedRouter.forEach(route => {
            //     if (route.children) {
            //         if (!route.meta) route.meta = {};
            //         route.meta.children = route.children;
            //     }
            // });
            this.menuData = allowedRouter;
        },
        extendRoutes (allowedRouter) {
            const vm = this;
            const originPath = R.clone(userPath);
            console.log('新路由', originPath);
            const newRoute = [...R.clone(allowedRouter), ...R.clone(allowedRouter)];
            console.log('所有路由', newRoute);
            newRoute[1].meta.show = false;
            newRoute[1].component = () => import('./components/Container.vue');
            // newRoute[1].name = newRoute[1].name + '-sub';
            // newRoute[1].path = newRoute[1].path + '-sub';
            // newRoute[1].children = [];
            // const originPath = userPath;
            // for (let v of newRoute[1].children) {
            //     const clone = R.merge({}, v);
            //     clone.meta.show = false;
            //     clone.path = v.path + '-sub';
            //     clone.name = v.name + '-sub';
            //     clone.component = () => import('./components/Container.vue');
            //     if (clone.children && clone.children.length) {
            //         for (let j of clone.children) {
            //             j.path = `${clone.path}/${j.name}`;
            //             j.name = `${j.name}-item`;
            //         }
            //     }
            //     allowedRouter[0].children.push(clone);
            // }
            // originPath[0].children = allowedRouter;
            const rex = new RegExp(newRoute[1].path, 'g');
            for (let v of newRoute[1].children) {
                // const clone = R.merge({}, v);
                v.meta.show = false;
                v.path = v.path.replace(rex, `${newRoute[1].path}-sub`);
                console.log(v.path.replace(rex, `${newRoute[1].path}-sub`));
                v.meta.show = false;
                v.name = v.name + '-sub';
                console.log(v.name);
                v.component = () => import('./components/Container.vue');
                if (v.children && v.children.length) {
                    for (let j of v.children) {
                        j.path = j.path.replace(rex, `${newRoute[1].path}-sub`);
                        j.name = `${j.name}-item`;
                    }
                }
                // newRoute[1].children.push(clone);
                // allowedRouter[0].children.push(clone);
            }
            newRoute[1].name = newRoute[1].name + '-sub';
            newRoute[1].path = newRoute[1].path + '-sub';
            originPath[0].children = newRoute;
            console.log(originPath);
            vm.$router.addRoutes(
                originPath.concat([
                    {
                        path: '*',
                        redirect: '/404'
                    }
                ])
            );
        },
        setInterceptor (resourcePermission) {
            const vm = this;
            vm.myInterceptor = intercept.instance.interceptors.request.use(config => {
                console.log(config);
                console.log('请求的url:', config.url);
                // 先判断是否放行的url
                if (!oauthconfig.allowUrls[config.url]) {
                    // 得到类权限路径
                    const perName = config.url
                        .replace(config.baseURL, '')
                        .replace('/GET', '')
                        .replace('/POST', '')
                        .replace('/DELETE', '')
                        .split('?')[0];
                    console.log('perName', perName);
                    // 转成权限格式
                    // let reg1 = perName.match(/^(\/[^/]+\/)[^/]+$/);
                    // console.log("reg1", reg1);
                    //  /path/${param}
                    // if (reg1) {
                    //   perName = reg1[1] + "**";
                    // }
                    // console.log("reg1-perName", perName);
                    // let reg2 = perName.match(/^\/[^/]+\/([^/]+)\/[^/]+$/);
                    // console.log("reg2", reg2);
                    //  /path/${param}/path
                    // if (reg2) {
                    //   perName = perName.replace(reg2[1], "*");
                    // }
                    // console.log("reg2-perName", perName);
                    // 匹配权限
                    console.log('aaaaa', config.method + ',' + perName);
                    if (!resourcePermission[config.method + ',' + perName]) {
                        console.warn(resourcePermission, config.method + ',' + perName);
                        // vm.$message({
                        //     message: '无访问权限，请联系系统管理员',
                        //     type: 'warning'
                        // });

                        vm.$toast({
                            position: 'top',
                            message: '无访问权限，请联系系统管理员'
                            // iconClass: 'icon icon-success'
                        });
                        return Promise.reject(new TypeError('no permission'));
                    }
                }
                return config;
            });
        },
        getPermission (userInfo) {
            console.log(userInfo);
            const resourcePermission = {};
            if (Array.isArray(userInfo.resources)) {
                for (let e of userInfo.resources) {
                    const key = e.httpMethod.toLowerCase() + ',' + e.resourceString;
                    resourcePermission[key] = true;
                }
                // userInfo.resources.forEach(function(e, i) {
                //     const key = e.httpMethod.toLowerCase() + ',' + e.resourceString;
                //     resourcePermission[key] = true;
                // });
            }
            return resourcePermission;
        },
        getRoutes (userInfo) {
            if (!userInfo.menus) {
                return console.warn(userInfo);
            }
            //   let vm = this
            let allowedRouter = [];
            // 转成多维数组
            const arrayMenus = buildMenu(userInfo.menus);
            console.log('菜单多维度数组', arrayMenus);
            // 转成hash
            const hashMenus = {};
            const setMenu2Hash = function(array, base) {
                array.map(key => {
                    if (key.resourceName) {
                        const hashKey = ((base ? base + '/' : '') + key.resourceName).replace(/^\//, '');
                        hashMenus['/' + hashKey] = true;
                        if (Array.isArray(key.children)) {
                            setMenu2Hash(key.children, key.resourceName);
                        }
                    }
                });
            };
            setMenu2Hash(arrayMenus);
            console.log('hashMenus', hashMenus);
            // 遍历本地路由
            const findLocalRoute = (array, base) => {
                console.log('ARRRRR', array);
                const replyResult = [];
                array.forEach(function(route) {
                    // console.log('routeeeeee', route);
                    const pathKey = (base ? base + '/' : '') + route.path;
                    // console.log('pathKey', pathKey);
                    if (hashMenus[pathKey] || route.meta.allow) {
                        console.log(Array.isArray(route.children));
                        if (Array.isArray(route.children)) {
                            route.children = findLocalRoute(route.children, route.path);
                            route.meta.children = findLocalRoute(route.children, route.path);
                        }
                        replyResult.push(route);
                    }
                });
                if (base) {
                    return replyResult;
                } else {
                    allowedRouter = allowedRouter.concat(replyResult);
                }
            };
            const originPath = userPath[0].children;
            console.log('aaaaaa', originPath);
            findLocalRoute(originPath);
            console.log('完整路由', allowedRouter);
            return allowedRouter;
        },
        async signin (cb) {
            const vm = this;
            const localToken = session('token'); // 获取认证
            console.log('app_localToken', localToken);
            if (!localToken || !localToken.access_token) {
                return vm.$router.push({
                    path: '/login',
                    query: { from: vm.$router.currentRoute.path }
                });
            }
            const { common } = intercept.instance.defaults.headers;
            common['Authorization'] = 'Bearer ' + localToken.access_token;
            console.log(oauthApi);
            try {
                const { data } = await this.getUserByToken();
                console.log('用户信息：', data);
                const userInfo = data;
                common['useruuid'] = userInfo.uuid;

                // 判断是否只有一个修理厂，如果是将修理厂设置到header
                if (userInfo.shops) {
                    if (userInfo.shops.isArray && userInfo.shops.length > 0) {
                        const shopUUID = userInfo.shops[0].uuid;
                        // 将登录用户的修理厂uuid 设置到header
                        common['shopuuid'] = shopUUID;
                    }
                }
                const resourcePermission = vm.getPermission(userInfo);
                console.log('处理资源权限', resourcePermission);
                vm.setInterceptor(resourcePermission);
                const allowedRouter = vm.getRoutes(userInfo);
                console.log(allowedRouter);

                // 注入动态路由
                vm.extendRoutes(allowedRouter);
                // 保存菜单数据
                vm.storageMenu(allowedRouter[0].children);
                // 用户信息持久化
                // vm.storageUser(Object.assign(localUser || {}, userInfo))
                vm.userData = userInfo;
                Vue.prototype.$_has = rArray => {
                    let resources = [];
                    let permission = true;
                    if (Array.isArray(rArray)) {
                        rArray.forEach(function(e) {
                            resources = resources.concat(e.p);
                        });
                    } else {
                        resources = resources.concat(rArray.p);
                    }
                    resources.forEach(function(p) {
                        if (!resourcePermission[p]) {
                            // console.log("进入", permission === false);
                            permission = false;
                        }
                    });
                    return permission;
                };
                typeof cb === 'function' && cb();
            } catch (err) {
                console.error(err);
                catchError(err);
            }
            // 通过store去获取缓存用户到store
            // this.getUserByToken().then(res => {
            //     const userInfo = res;
            //     console.log('请求用户', userInfo);
            //     // 将登录用户的uuid 设置到header
            //     common['useruuid'] = userInfo.uuid;
            //     // 判断是否只有一个修理厂，如果是将修理厂设置到header
            //     if (userInfo.shops) {
            //         if (userInfo.shops.isArray && userInfo.shops.length > 0) {
            //             const shopUUID = userInfo.shops[0].uuid;
            //             // 将登录用户的修理厂uuid 设置到header
            //             common['shopuuid'] = shopUUID;
            //         }
            //     }
            //     // 取得资源权限
            //     const resourcePermission = vm.getPermission(userInfo);
            //     console.log('处理资源权限', resourcePermission);
            //     // 请求拦截
            //     vm.setInterceptor(resourcePermission);
            //     // 获得路由
            //     const allowedRouter = vm.getRoutes(userInfo);
            //     if (!allowedRouter || !allowedRouter.length) {
            //         util.session('token', '');
            //         return document.body.innerHTML === '<h1>账号访问受限，请联系系统管理员！</h1>';
            //     }
            //     // 注入动态路由
            //     vm.extendRoutes(allowedRouter);
            //     // 保存菜单数据
            //     vm.storageMenu(allowedRouter);
            //     // 用户信息持久化
            //     // vm.storageUser(Object.assign(localUser || {}, userInfo))
            //     vm.userData = userInfo;
            //     // 权限检查方法
            //     Vue.prototype.$_has = function(rArray) {
            //         let resources = [];
            //         let permission = true;
            //         if (Array.isArray(rArray)) {
            //             rArray.forEach(function(e) {
            //                 resources = resources.concat(e.p);
            //             });
            //         } else {
            //             resources = resources.concat(rArray.p);
            //         }
            //         resources.forEach(function(p) {
            //             if (!resourcePermission[p]) {
            //                 // console.log("进入", permission === false);
            //                 permission = false;
            //             }
            //         });
            //         return permission;
            //     };
            //     typeof cb === 'function' && cb();
            // });
        },
        loginDirect (newPath) {
            this.signin(() => {
                this.$router.replace({ path: newPath || '/' });
            });
        },
        logoutDirect () {
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
    created () {
        this.signin();
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
