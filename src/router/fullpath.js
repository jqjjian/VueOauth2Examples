export default [
    {
        path: '/',
        name: 'home',
        // component: () => import('../views/index.vue'),
        component: () => import('../components/Container.vue'),
        redirect: '/mobile/business-manage',
        children: [
            {
                path: '/mobile',
                name: 'mobile',
                // component: () => import('../components/Container.vue'),
                component: () => import('../views/index.vue'),
                meta: {
                    name: '养车易移动端系统'
                    // icon: 'fa fa-usersetting'
                },
                children: [
                    {
                        path: '/mobile/customer-manage',
                        name: 'customer-manage',
                        component: () => import('../views/customer-manage/index.vue'),
                        meta: {
                            name: '客户管理',
                            icon: 'fa-kehuguanli'
                        }
                    },
                    {
                        path: '/mobile/business-manage',
                        name: 'business-manage',
                        component: () => import('../views/business-manage/index.vue'),
                        meta: {
                            name: '业务管理',
                            icon: 'fa-yewu'
                        },
                        children: [
                            {
                                path: '/mobile/business-manage/work',
                                name: 'work',
                                component: () => import('../views/business-manage/work/WorkList.vue'),
                                meta: {
                                    name: '工单',
                                    icon: 'fa-order'
                                }
                            },
                            {
                                path: '/mobile/business-manage/work-services',
                                name: 'work-services',
                                component: () => import('../views/business-manage/work/WorkEdit.vue'),
                                meta: {
                                    allow: true,
                                    hide: true,
                                    name: '工单服务项'
                                }
                            },
                            {
                                path: '/mobile/business-manage/create-service',
                                name: 'CreateService',
                                component: () => import('../views/business-manage/work/CreateService.vue'),
                                meta: {
                                    name: '服务开单',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/edit-customer-info',
                                name: 'EditCustomerInfo',
                                component: () => import('../views/business-manage/work/EditCustomerInfo.vue'),
                                meta: {
                                    name: '编辑送修人信息',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/edit-car-info',
                                name: 'EditCarInfo',
                                component: () => import('../views/business-manage/work/EditCarInfo.vue'),
                                meta: {
                                    name: '编辑车辆信息',
                                    allow: true,
                                    hide: true
                                }
                            },
                            // {
                            //     path: '/mobile/business-manage/order-price',
                            //     name: 'order-price',
                            //     component: () => import('../views/business-manage/order-price.vue'),
                            //     meta: {
                            //         name: '编辑工单',
                            //         allow: true,
                            //         hide: true
                            //     }
                            // },
                            // {
                            //     path: '/mobile/business-manage/pending',
                            //     name: 'pending',
                            //     component: () => import('../views/business-manage/pending.vue'),
                            //     meta: {
                            //         name: '工单'
                            //     }
                            // },
                            // {
                            //     path: '/mobile/business-manage/pendingEdit',
                            //     name: 'pendingEdit',
                            //     component: () => import('../views/business-manage/pendingEdit.vue'),
                            //     meta: {
                            //         name: '工单',
                            //         allow: true,
                            //         hide: true
                            //     }
                            // },
                            // {
                            //     path: '/mobile/business-manage/construction',
                            //     name: 'construction',
                            //     component: () => import('../views/business-manage/construction.vue'),
                            //     meta: {
                            //         name: '待施工'
                            //     }
                            // },
                            // {
                            //     path: '/mobile/business-manage/constructionEdit',
                            //     name: 'constructionOperation',
                            //     component: () => import('../views/business-manage/construction-operation.vue'),
                            //     meta: {
                            //         name: '待施工',
                            //         allow: true,
                            //         hide: true
                            //     }
                            // },
                            // {
                            //     path: '/mobile/business-manage/quality-inspection',
                            //     name: 'quality-inspection',
                            //     component: () => import('../views/business-manage/quality-inspection.vue'),
                            //     meta: {
                            //         name: '待质检'
                            //     }
                            // },
                            {
                                path: '/mobile/business-manage/finance-manage',
                                name: 'finance-manage',
                                component: () => import('../views/finance-manage/index.vue'),
                                meta: {
                                    name: '财务管理',
                                    icon: 'fa-caiwu'
                                }
                            },
                            {
                                path: '/mobile/business-manage/billing-detail',
                                name: 'billing-detail',
                                component: () => import('../views/finance-manage/billing-detail.vue'),
                                meta: {
                                    name: '订单详情',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/warehouse-manage',
                                name: 'warehouse-manage',
                                component: () => import('../views/warehouse-manage/index.vue'),
                                meta: {
                                    name: '仓库管理',
                                    icon: 'fa-cangku'
                                }
                            },
                            {
                                path: '/mobile/warehouse-manage/fitting-info',
                                name: 'fitting-info',
                                component: () => import('../views/warehouse-manage/fitting-info.vue'),
                                meta: {
                                    name: '配件新增/修改',
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/service-log',
                                name: 'service-log',
                                component: () => import('../components/default.vue'),
                                meta: {
                                    name: '服务记录',
                                    icon: 'fa-yuyuejilu'
                                }
                            },
                            {
                                path: '/mobile/business-manage/reservation-record',
                                name: 'reservation-record',
                                component: () => import('../views/business-manage/reservation/index.vue'),
                                meta: {
                                    name: '预约记录',
                                    icon: 'fa-yuyue'
                                }
                            },
                            {
                                path: '/mobile/business-manage/reservation-details',
                                name: 'reservation-details',
                                component: () => import('../views/business-manage/reservation/details.vue'),
                                meta: {
                                    name: '预约详情',
                                    // icon: 'fa-yuyue'
                                    allow: true,
                                    hide: true
                                }
                            },
                            {
                                path: '/mobile/business-manage/trailers-service',
                                name: 'trailers-service',
                                component: () => import('../components/default.vue'),
                                meta: {
                                    name: '拖车服务',
                                    icon: 'fa-cheliangweixiubaoyang'
                                }
                            }
                        ]
                    },
                    {
                        path: '/mobile/mall',
                        name: 'mall',
                        component: () => import('../views/mall/index.vue'),
                        meta: {
                            name: '商城',
                            icon: 'fa-store_icon'
                        }
                    },
                    {
                        path: '/mobile/my',
                        name: 'my',
                        component: () => import('../views/my/index.vue'),
                        meta: {
                            name: '我的',
                            icon: 'fa-user'
                        }
                    }
                ]
            }
        ]
    }
]
