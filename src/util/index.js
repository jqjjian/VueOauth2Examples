// import { MessageBox } from 'mint-ui';
import Vue from 'vue';
export const session = function(key, value) {
    if (value === void 0) {
        const localToken = sessionStorage.getItem(key);
        console.log('lsVal:', localToken);
        if (localToken && localToken.indexOf('autostringify-') === 0) {
            return JSON.parse(localToken.split('autostringify-')[1]);
        } else {
            return localToken;
        }
    } else {
        if (typeof value === 'object' || Array.isArray(value)) {
            value = 'autostringify-' + JSON.stringify(value);
        }
        return sessionStorage.setItem(key, value);
    }
};

export const go = (url, $router) => {
    if (/^javas/.test(url) || !url) return;
    const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url));
    if (useRouter) {
        if (typeof url === 'object' && url.replace === true) {
            $router.replace(url);
        } else {
            url === 'BACK' ? $router.go(-1) : $router.push(url);
        }
    } else {
        window.location.href = url;
    }
};

// 菜单数据组织
export const buildMenu = function(array, ckey = 'parentId') {
    console.log('菜单结构', array);
    const menuData = [];
    const indexKeys = Array.isArray(array) ? array.map(e => {
        return e.id;
    }) : [];
    for (let v of array) {
        // 一级菜单
        if (!v[ckey] || v[ckey] === v.id) {
            delete v[ckey];
            menuData.push(v);
        } else if (Array.isArray(indexKeys)) {
            // 检测ckey有效性
            let parentIndex = indexKeys.findIndex(function(id) {
                return id === v[ckey];
            });
            if (parentIndex === -1) {
                menuData.push(v);
            }
        }
    }
    // array.forEach(function(e, i) {
    //     // 一级菜单
    //     if (!e[ckey] || e[ckey] === e.id) {
    //         delete e[ckey];
    //         menuData.push(e); // 深拷贝
    //     } else if (Array.isArray(indexKeys)) {
    //         // 检测ckey有效性
    //         let parentIndex = indexKeys.findIndex(function(id) {
    //             return id === e[ckey];
    //         });
    //         if (parentIndex === -1) {
    //             menuData.push(e);
    //         }
    //     }
    // });
    console.log('菜单AA', menuData);
    const findChildren = parentArr => {
        if (Array.isArray(parentArr) && parentArr.length) {
            for (let parentNode of parentArr) {
                for (let node of array) {
                    if (parentNode.id === node[ckey]) {
                        if (parentNode.children) {
                            parentNode.children.push(node);
                        } else {
                            parentNode.children = [node];
                        }
                    }
                }
                if (parentNode.children) {
                    findChildren(parentNode.children);
                }
            }
            // parentArr.forEach(function(parentNode) {
            //     array.forEach(function(node) {
            //         if (parentNode.id === node[ckey]) {
            //             if (parentNode.children) {
            //                 parentNode.children.push(node);
            //             } else {
            //                 parentNode.children = [node];
            //             }
            //         }
            //     });
            //     if (parentNode.children) {
            //         findChildren(parentNode.children);
            //     }
            // });
        }
    };
    findChildren(menuData);
    return menuData;
};

export const catchError = function(error) {
    if (error.response) {
        const infos = {
            '400': () => {
                // Vue.$message({
                //     message: error.response.data.message || '请求参数异常',
                //     type: 'error'
                // });
                Vue.$toast({
                    position: 'top',
                    message: error.response.data.message || '请求参数异常'
                    // iconClass: 'icon icon-success'
                });
                // MessageBox.alert(error.response.data.message || '请求参数异常').then(action => {
                //     console.log(action);
                // });
            },
            '401': () => {
                sessionStorage.removeItem('user');
                // Vue.$message({
                //     message: error.response.data.message || '密码错误或账号不存在！',
                //     type: 'warning',
                //     onClose: function() {
                //         location.reload();
                //     }
                // });
                Vue.$toast({
                    position: 'top',
                    message: error.response.data.message || '密码错误或账号不存在！'
                    // iconClass: 'icon icon-success'
                });
                // MessageBox.alert(error.response.data.message || '密码错误或账号不存在！').then(action => {
                //     location.reload();
                // });
            },
            '403': () => {
                sessionStorage.removeItem('user');
                // Vue.$message({
                //     message: error.response.data.message || '无访问权限，请联系企业管理员',
                //     type: 'warning'
                // });
                Vue.$toast({
                    position: 'top',
                    message: error.response.data.message || '无访问权限，请联系管理员！'
                    // iconClass: 'icon icon-success'
                });
                // MessageBox.alert(error.response.data.message || '无访问权限，请联系企业管理员！').then(action => {
                //     console.log(action);
                // });
            }
        };
        if (infos.hasOwnProperty(`${error.response.status}`)) {
            infos[`${error.response.status}`]();
        } else {
            // Vue.$message({
            //     message: error.response.data.message || '服务端异常，请联系技术支持',
            //     type: 'error'
            // });
            Vue.$toast({
                position: 'top',
                message: error.response.data.message || '服务端异常，请联系技术支持。'
                // iconClass: 'icon icon-success'
            });
            // MessageBox.alert(error.response.data.message || '服务端异常，请联系技术支持。').then(action => {
            //     console.log(action);
            // });
        }
    }
    return Promise.reject(error);
};
