import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/common/404.vue')
    }
];

const router = new Router({
    routes
});

router.beforeEach((to, from, next) => {
    const routeName = to.meta.name || to.name;
    window.document.title = (routeName ? routeName + ' - ' : '') + '养车易汽车服务管理系统';
    next();
});

export default router;
