<template>
    <div>
        <router-view id="app" @login="loginDirect" @logout="logoutDirect"></router-view>
    </div>
</template>

<script>
import Vue from 'vue'
import { catchError, buildMenu, getLoginSession } from '@/util'
import { intercept } from '@/api'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import oauthconfig from '@/config'
import userPath from '@/router/fullpath'
import * as R from 'ramda'
export default {
    name: 'App',
    data() {
        return {
            popupVisible: false,
            myInterceptor: null,
            menuData: [],
            userData: []
        }
    },
    computed: {
        ...mapGetters(['Permission'])
    },
    methods: {
        ...mapActions('oauth', ['getUserResources', 'initializeUser']),
        ...mapMutations(['SET_PERMISSION']),
        storageMenu(allowedRouter) {
            // allowedRouter.forEach(route => {
            //     if (route.children) {
            //         if (!route.meta) route.meta = {};
            //         route.meta.children = route.children;
            //     }
            // });
            this.menuData = allowedRouter
        },
        extendRoutes(allowedRouter) {
            const vm = this
            const originPath = R.clone(userPath)
            console.log('新路由', originPath)
            const newRoute = [...R.clone(allowedRouter), ...R.clone(allowedRouter)]
            console.log('所有路由', newRoute)
            newRoute[1].meta.show = false
            newRoute[1].component = () => import('./components/Container.vue')
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
            const rex = new RegExp(newRoute[1].path, 'g')
            for (let v of newRoute[1].children) {
                // const clone = R.merge({}, v);
                v.meta.show = false
                v.path = v.path.replace(rex, `${newRoute[1].path}-sub`)
                console.log(v.path.replace(rex, `${newRoute[1].path}-sub`))
                v.meta.show = false
                v.name = v.name + '-sub'
                console.log(v.name)
                v.component = () => import('./components/Container.vue')
                if (v.children && v.children.length) {
                    for (let j of v.children) {
                        j.path = j.path.replace(rex, `${newRoute[1].path}-sub`)
                        j.name = `${j.name}-item`
                    }
                }
                // newRoute[1].children.push(clone);
                // allowedRouter[0].children.push(clone);
            }
            newRoute[1].name = newRoute[1].name + '-sub'
            newRoute[1].path = newRoute[1].path + '-sub'
            originPath[0].children = newRoute
            console.log(originPath)
            vm.$router.addRoutes(
                originPath.concat([
                    {
                        path: '*',
                        redirect: '/404'
                    }
                ])
            )
        },
        setInterceptor(resourcePermission) {
            const vm = this
            vm.myInterceptor = intercept.instance.interceptors.request.use(config => {
                console.log(config)
                console.log('请求的url:', config.url)
                // 得到类权限路径
                const baseAuthUrl = window.gloable.authUrl
                const payUrl = window.gloable.payUrl
                const localUrl = window.gloable.localUrl
                const perName = config.url
                    .replace(localUrl, '')
                    .replace(config.baseURL, '')
                    .replace(baseAuthUrl, '')
                    .replace(payUrl, '')
                    .replace('/GET', '')
                    .replace('/POST', '')
                    .replace('/DELETE', '')
                    .split('?')[0]
                console.log('perName', perName)
                // 先判断是否放行的url
                if (!oauthconfig.allowUrls[perName]) {
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
                    console.log('接口权限标识', config.method + ',' + perName)
                    if (!resourcePermission.api[config.method + ',' + perName]) {
                        console.warn(resourcePermission.api, config.method + ',' + perName)
                        // vm.$message({
                        //     message: '无访问权限，请联系系统管理员',
                        //     type: 'warning'
                        // });

                        vm.$toast({
                            position: 'top',
                            message: '无访问权限，请联系系统管理员'
                            // iconClass: 'icon icon-success'
                        })
                        return Promise.reject(new TypeError('no permission'))
                    }
                }
                return config
            })
        },
        getPermission(userInfo) {
            console.log(userInfo)
            const resourcePermission = {
                api: {},
                vis: {},
                dis: {}
            }
            if (Array.isArray(userInfo.resources) && userInfo.resources.length) {
                let key = null
                for (let e of userInfo.resources) {
                    if (e.resourceType === 'api') {
                        key = e.httpMethod.toLowerCase() + ',' + e.resourceString
                    } else {
                        key = e.resourceString
                    }
                    resourcePermission[e.resourceType][key] = true
                }
                // userInfo.resources.forEach(function(e, i) {
                //     const key = e.httpMethod.toLowerCase() + ',' + e.resourceString;
                //     resourcePermission[key] = true;
                // });
            }
            this.SET_PERMISSION(resourcePermission)
            return resourcePermission
        },
        getRoutes(userInfo) {
            if (!userInfo.menus) {
                return console.warn(userInfo)
            }
            //   let vm = this
            let allowedRouter = []
            // 转成多维数组
            const arrayMenus = buildMenu(userInfo.menus)
            console.log('菜单多维度数组', arrayMenus)
            // 转成hash
            const hashMenus = {}
            const setMenu2Hash = function(array, base) {
                array.map(key => {
                    if (key.resourceName) {
                        const hashKey = ((base ? base + '/' : '') + key.resourceName).replace(/^\//, '')
                        hashMenus['/' + hashKey] = true
                        if (Array.isArray(key.children)) {
                            setMenu2Hash(key.children, key.resourceName)
                        }
                    }
                })
            }
            setMenu2Hash(arrayMenus)
            console.log('hashMenus', hashMenus)
            // 遍历本地路由
            const findLocalRoute = (array, base) => {
                console.log('ARRRRR', array)
                const replyResult = []
                array.forEach(function(route) {
                    // console.log('routeeeeee', route);
                    const pathKey = (base ? base + '/' : '') + route.path
                    // console.log('pathKey', pathKey);
                    if (hashMenus[pathKey] || route.meta.allow) {
                        console.log(Array.isArray(route.children))
                        if (Array.isArray(route.children)) {
                            route.children = findLocalRoute(route.children, route.path)
                            route.meta.children = findLocalRoute(route.children, route.path)
                        }
                        replyResult.push(route)
                    }
                })
                if (base) {
                    return replyResult
                } else {
                    allowedRouter = allowedRouter.concat(replyResult)
                }
            }
            const originPath = userPath[0].children
            console.log('aaaaaa', originPath)
            findLocalRoute(originPath)
            console.log('完整路由', allowedRouter)
            return allowedRouter
        },
        async signin(cb) {
            const vm = this
            const localToken = getLoginSession() // 获取认证
            console.log('app_localToken', localToken)
            if (!localToken || !localToken.access_token) {
                return vm.$router.push({
                    path: '/login',
                    query: { from: vm.$router.currentRoute.path }
                })
            }
            const { common } = intercept.instance.defaults.headers
            common['Authorization'] = 'Bearer ' + localToken.access_token
            try {
                const { data } = await this.getUserResources()
                console.log('用户信息：', data)
                const userInfo = data
                common['useruuid'] = userInfo.uuid
                if (userInfo.shops.length) {
                    common['shopuuid'] = userInfo.shops[0].uuid
                }
                // 判断是否只有一个修理厂，如果是将修理厂设置到header
                if (userInfo.shops) {
                    if (userInfo.shops.isArray && userInfo.shops.length > 0) {
                        const shopUUID = userInfo.shops[0].uuid
                        // 将登录用户的修理厂uuid 设置到header
                        common['shopuuid'] = shopUUID
                    }
                }
                const resourcePermission = vm.getPermission(userInfo)
                console.log('处理资源权限', resourcePermission)
                vm.setInterceptor(resourcePermission)
                const allowedRouter = vm.getRoutes(userInfo)
                console.log(allowedRouter)

                // 注入动态路由
                vm.extendRoutes(allowedRouter)
                // 保存菜单数据
                vm.storageMenu(allowedRouter[0].children)
                // 用户信息持久化
                // vm.storageUser(Object.assign(localUser || {}, userInfo))
                vm.userData = userInfo
                Vue.prototype.$_has = p => {
                    console.log(this.Permission)
                    console.log(p)
                    let _permission = false
                    if (p.currentP.value) {
                        if (
                            p.currentP.hasOwnProperty('value') &&
                            this.Permission.vis.hasOwnProperty(p.currentP.pTag) &&
                            this.Permission.vis[p.currentP.pTag] === true
                        ) {
                            console.log(111)
                            _permission = true
                        }
                    } else {
                        console.log(222)
                        for (let v of Object.values(p.allP)) {
                            console.log('ptag', v.pTag)
                            console.log('AAAAAAAA', this.Permission.vis.hasOwnProperty(v.pTag))
                            if (v.value) {
                                if (this.Permission.vis.hasOwnProperty(v.pTag)) {
                                    _permission = false
                                    break
                                }
                            } else {
                                _permission = true
                            }
                        }
                    }
                    // if (
                    //     p.currentP.hasOwnProperty('value') &&
                    //     this.Permission.vis.hasOwnProperty(p.currentP.pTag) &&
                    //     this.Permission.vis[p.currentP.pTag] === true
                    // ) {
                    //     console.log(111)
                    //     _permission = true
                    // } else {
                    //     console.log(222)
                    //     for (let v of Object.values(p.allP)) {
                    //         console.log('ptag', v.pTag)
                    //         console.log('AAAAAAAA', this.Permission.vis.hasOwnProperty(v.pTag))
                    //         if (v.value) {
                    //             if (this.Permission.vis.hasOwnProperty(v.pTag)) {
                    //                 _permission = false
                    //             }
                    //         } else {
                    //             _permission = true
                    //         }
                    //     }
                    // }
                    // if (Array.isArray(rArray)) {
                    //     rArray.forEach(function(e) {
                    //         resources = resources.concat(e.p)
                    //     })
                    // } else {
                    //     resources = resources.concat(rArray.p)
                    // }
                    // resources.forEach(function(p) {
                    //     if (!resourcePermission[p]) {
                    //         // console.log("进入", permission === false);
                    //         permission = false
                    //     }
                    // })
                    return R.clone(_permission)
                }
                typeof cb === 'function' && cb()
            } catch (err) {
                console.error(err)
                catchError(err)
            }
        },
        loginDirect(newPath) {
            this.signin(() => {
                this.$router.replace({ path: newPath || '/' })
            })
        },
        logoutDirect() {}
    },
    watch: {
        popupVisible(val) {
            if (val) {
                setTimeout(() => {
                    this.popupVisible = false
                }, 2000)
            }
        }
    },
    created() {
        this.signin()
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
