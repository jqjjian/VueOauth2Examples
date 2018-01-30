import { MessageBox } from 'mint-ui';
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

// 菜单数据组织
export const buildMenu = function(array, ckey = 'parentId') {
    console.log('菜单结构', array);
    const menuData = [];
    const indexKeys = Array.isArray(array) ? array.map(e => {
        return e.id;
    }) : [];
    for (let v of array) {
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
    let findChildren = function(parentArr) {
        if (Array.isArray(parentArr) && parentArr.length) {
            parentArr.forEach(function(parentNode) {
                array.forEach(function(node) {
                    if (parentNode.id === node[ckey]) {
                        if (parentNode.children) {
                            parentNode.children.push(node);
                        } else {
                            parentNode.children = [node];
                        }
                    }
                });
                if (parentNode.children) {
                    findChildren(parentNode.children);
                }
            });
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
                MessageBox.alert(error.response.data.message || '请求参数异常').then(action => {
                    console.log(action);
                });
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
                MessageBox.alert(error.response.data.message || '密码错误或账号不存在！').then(action => {
                    location.reload();
                });
            },
            '403': () => {
                sessionStorage.removeItem('user');
                // Vue.$message({
                //     message: error.response.data.message || '无访问权限，请联系企业管理员',
                //     type: 'warning'
                // });
                MessageBox.alert(error.response.data.message || '无访问权限，请联系企业管理员！').then(action => {
                    console.log(action);
                });
            }
        };
        if (infos.hasOwnProperty(`${error.response.status}`)) {
            infos[`${error.response.status}`]();
        } else {
            // Vue.$message({
            //     message: error.response.data.message || '服务端异常，请联系技术支持',
            //     type: 'error'
            // });
            MessageBox.alert(error.response.data.message || '服务端异常，请联系技术支持。').then(action => {
                console.log(action);
            });
        }
    }
    return Promise.reject(error);
};
