export default [
    {
        path: '/',
        name: '首页',
        component: () => import('../views/index.vue'),
        redirect: '/mobile/business-manage',
        children: [
            {
                path: '/mobile',
                name: 'mobile',
                component: () => import('../components/Container.vue'),
                meta: {
                    name: '养车易移动端系统'
                    // icon: 'fa fa-usersetting'
                },
                children: [
                    {
                        path: '/mobile/customer-manage',
                        name: 'customer-manage',
                        meta: {
                            name: '客户管理'
                        }
                    },
                    {
                        path: '/mobile/business-manage',
                        name: 'business-manage',
                        component: () => import('../views/business-manage/index.vue'),
                        meta: {
                            name: '业务管理'
                        },
                        children: [
                            {
                                path: '/mobile/business-manage/order-price',
                                name: 'order-price',
                                component: () => import('../views/business-manage/order-price.vue'),
                                meta: {
                                    name: '开单报价'
                                }
                            },
                            {
                                path: '/mobile/business-manage/pending',
                                name: 'pending',
                                component: () => import('../views/business-manage/pending.vue'),
                                meta: {
                                    name: '待审批'
                                }
                            },
                            {
                                path: '/mobile/business-manage/pendingEdit',
                                name: 'pendingEdit',
                                component: () => import('../views/business-manage/order-price.vue'),
                                meta: {
                                    name: '待审批',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/construction',
                                name: 'construction',
                                component: () => import('../views/business-manage/construction.vue'),
                                meta: {
                                    name: '待施工'
                                }
                            },
                            {
                                path: '/mobile/business-manage/constructionEdit',
                                name: 'constructionOperation',
                                component: () => import('../views/business-manage/construction-operation.vue'),
                                meta: {
                                    name: '待施工',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/quality-inspection',
                                name: 'quality-inspection',
                                meta: {
                                    name: '待质检'
                                }
                            },
                            {
                                path: '/mobile/business-manage/finance-manage',
                                name: 'finance-manage',
                                meta: {
                                    name: '财务管理'
                                }
                            },
                            {
                                path: '/mobile/business-manage/warehouse-manage',
                                name: 'warehouse-manage',
                                meta: {
                                    name: '仓库管理'
                                }
                            },
                            {
                                path: '/mobile/business-manage/service-log',
                                name: 'service-log',
                                meta: {
                                    name: '服务记录'
                                }
                            },
                            {
                                path: '/mobile/business-manage/reservation-record',
                                name: 'reservation-record',
                                meta: {
                                    name: '预约记录'
                                }
                            },
                            {
                                path: '/mobile/business-manage/trailers-service',
                                name: 'trailers-service',
                                meta: {
                                    name: '拖车服务'
                                }
                            }
                        ]
                    },
                    {
                        path: '/mobile/mall',
                        name: 'mall',
                        meta: {
                            name: '商城'
                        }
                    },
                    {
                        path: '/mobile/my',
                        name: 'my',
                        meta: {
                            name: '我的'
                        }
                    }
                ]
            }
        ]
    }
];
