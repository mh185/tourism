import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
import settingRouter from './modules/setting' // 系统设置
/**
 * constantRoutes
 * 不需要权限的基础页面
 * 可以访问以下所有页面
 */
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      title: '首页',
      svg: 'dashboard'
    }
  }]
}

  // {
  //   path: '/commodity',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'commodity',
  //       component: () => import('@/views/commodity/index'),
  //       meta: { title: 'commodity', icon: 'commodity' }
  //     }
  //   ]
  // },
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  settingRouter,
  // {
  //   path: '/business',
  //   component: Layout,
  //   // redirect: '/management/business',
  //   // name: '商家管理',
  //   // meta: { title: '商家管理', icon: 'el-icon-s-help' },
  //   children: [{
  //     path: 'index',
  //     name: '商家管理',
  //     component: () => import('@/views/BusinessManagement/index'),
  //     meta: {
  //       title: '商家管理',
  //       icon: 'table'
  //     }
  //   }]
  // },
  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/hotel',
    name: 'commodity',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-goods'
    },
    children: [
      // {
      //   path: 'hotel',
      //   name: 'hotel',
      //   component: () => import('@/views/commodity/hotel/index'),
      //   meta: {
      //     title: '酒店商家商品',
      //     // icon: 'hotel'
      //   }
      // },
      // {
      //   path: 'ordinaryBusiness',
      //   name: 'ordinaryBusiness',
      //   component: () => import('@/views/commodity/ordinaryBusiness/index'),
      //   meta: {
      //     title: '普通商家商品',
      //     // icon: 'ordinaryBusiness'
      //   }
      // },
      {
        path: 'scenicArea',
        name: 'scenicArea',
        component: () => import('@/views/commodity/scenicArea/index'),
        meta: {
          title: '景区商家商品'
          // icon: 'scenicArea'
        }
      },
      {
        path: 'travelAgency',
        name: 'travelAgency',
        component: () => import('@/views/commodity/travelAgency/index'),
        meta: {
          title: '旅行社商家商品'
          // icon: 'travelAgency'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/income',
    name: 'finance',
    meta: {
      title: '财务管理',
      icon: 'el-icon-s-order'
    },
    children: [{
      path: 'income',
      name: 'income',
      component: () => import('@/views/finance/income/index'),
      meta: {
        title: '收入流水'
        // icon: 'income'
      }
    },
    {
      path: 'withdrawDeposit',
      name: 'withdrawDeposit',
      component: () => import('@/views/finance/withdrawDeposit/index'),
      meta: {
        title: '提现管理'
        // icon: 'withdrawDeposit'
      }
    }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    name: 'statistics',
    meta: {
      title: '财务统计',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'statistics',
      name: 'Statistics-finance',
      component: () => import('@/views/statistics/index'),
      meta: {
        title: '财务统计',
        svg: 'table'
      }
    }]
  },
  {
    path: 'announcement',
    name: 'announcement',
    component: () => import('@/views/convention/announcement/index'),
    path: '/shop',
    component: Layout,
    redirect: '/shop/hotelShop/hotelShop',
    name: 'shop',
    meta: {
      title: '店铺管理',
      icon: 'el-icon-s-shop'
    },
    children: [
      // {
      //   path: 'shopHotel',
      //   name: 'shopHotel',
      //   component: () => import('@/views/shop/shopHotel/index'),
      //   redirect: '/shop/hotelShop/shopHotel',
      //   meta: {
      //     title: '酒店',
      //     icon: 'el-icon-s-home'
      //   },
      //   children: [{
      //       path: 'informationHotel',
      //       name: 'informationHotel',
      //       component: () => import('@/views/shop/shopHotel/informationHotel'),
      //       meta: {
      //         title: '店铺信息',
      //         icon: 'el-icon-goods'
      //       },
      //     },
      //     {
      //       path: 'orderFormHotel',
      //       name: 'orderFormHotel',
      //       component: () => import('@/views/shop/shopHotel/orderFormHotel'),
      //       meta: {
      //         title: '订单管理',
      //         icon: 'el-icon-document'
      //       },
      //     },
      //     {
      //       path: 'cancelHotel',
      //       name: 'cancelHotel',
      //       component: () => import('@/views/shop/shopHotel/cancelHotel'),
      //       meta: {
      //         title: '核销',
      //         icon: 'el-icon-delete'
      //       },
      //     }
      //   ]
      // },
      // {
      //   path: 'shopCommon',
      //   name: 'shopCommon',
      //   component: () => import('@/views/shop/shopCommon/index'),
      //   meta: {
      //     title: '普通商家',
      //     icon: 'el-icon-s-home'
      //   },
      //   children: [{
      //       path: 'informationCommon',
      //       name: 'informationCommon',
      //       component: () => import('@/views/shop/shopCommon/informationCommon'),
      //       meta: {
      //         title: '店铺信息',
      //         icon: 'el-icon-goods'
      //       },
      //     },
      //     {
      //       path: 'orderFormCommon',
      //       name: 'orderFormCommon',
      //       component: () => import('@/views/shop/shopCommon/orderFormCommon'),
      //       meta: {
      //         title: '订单管理',
      //         icon: 'el-icon-document'
      //       },
      //     },
      //   ]
      // },
      {
        path: 'shopScenicArea',
        name: 'shopScenicArea',
        component: () => import('@/views/shop/shopScenicArea/index'),
        meta: {
          title: '景区',
          icon: 'el-icon-s-home'
        },
        children: [{
          path: 'informationScenicArea',
          name: 'informationScenicArea',
          component: () => import('@/views/shop/shopScenicArea/informationScenicArea'),
          meta: {
            title: '店铺信息',
            icon: 'el-icon-goods'
          }
        },
        {
          path: 'orderScenicArea',
          name: 'orderScenicArea',
          component: () => import('@/views/shop/shopScenicArea/orderScenicArea'),
          meta: {
            title: '订单管理',
            icon: 'el-icon-document'
          }
        },
        {
          path: 'cancelScenicArea',
          name: 'cancelScenicArea',
          component: () => import('@/views/shop/shopScenicArea/cancelScenicArea'),
          meta: {
            title: '核销',
            icon: 'el-icon-delete'
          }
        },
        {
          path: 'encyclopediaScenicArea',
          name: 'encyclopediaScenicArea',
          component: () => import('@/views/shop/shopScenicArea/encyclopediaScenicArea'),
          meta: {
            title: '景区百科',
            icon: 'el-icon-document'
          }
        },
        {
          path: 'messageScenicArea',
          name: 'messageScenicArea',
          component: () => import('@/views/shop/shopScenicArea/messageScenicArea'),
          meta: {
            title: '景区资讯',
            icon: 'el-icon-document'
          }
        }
        ]
      },
      {
        path: 'shopTravelAgency',
        name: 'shopTravelAgency',
        component: () => import('@/views/shop/shopTravelAgency/index'),
        meta: {
          title: '旅行社',
          icon: 'el-icon-s-home'
        }
      }
    ]
  },
  {
    path: '/auditManagement',
    component: Layout,
    redirect: '/auditManagement/commentAudit',
    name: 'auditManagement',
    meta: {
      title: '审核管理',
      icon: 'el-icon-s-order'
    },
    children: [{
      path: 'commentAudit',
      name: 'commentAudit',
      component: () => import('@/views/auditManagement/commentAudit/index'),
      meta: {
        title: '评论审核'
        // icon: 'income'
      }
    },
    {
      path: 'merchantAudit',
      name: 'merchantAudit',
      component: () => import('@/views/auditManagement/merchantAudit/index'),
      meta: {
        title: '商家入驻审核'
        // icon: 'income'
      }
    },
    {
      path: 'courseAudit',
      name: 'courseAudit',
      component: () => import('@/views/auditManagement/courseAudit/index'),
      meta: {
        title: '路线审核'
        // icon: 'income'
      }
    },
    {
      path: 'commodityAudit',
      name: 'commodityAudit',
      component: () => import('@/views/auditManagement/commodityAudit/index'),
      meta: {
        title: '商品审核'
        // icon: 'income'
      }
    },
    {
      path: 'encyclopediaAudit',
      name: 'encyclopediaAudit',
      component: () => import('@/views/auditManagement/encyclopediaAudit/index'),
      meta: {
        title: '景区百科审核'
        // icon: 'income'
      }
    },
    {
      path: 'informationAudit',
      name: 'informationAudit',
      component: () => import('@/views/auditManagement/informationAudit/index'),
      meta: {
        title: '景区资讯审核'
        // icon: 'income'
      }
    },
    {
      path: 'withdrawDepositAudit',
      name: 'withdrawDepositAudit',
      component: () => import('@/views/auditManagement/withdrawDepositAudit/index'),
      meta: {
        title: '提现审核'
        // icon: 'income'
      }
    }
    ]
  },
  {
    path: '/applet',
    component: Layout,
    // redirect: '/applet/commentAudit',
    name: 'applet',
    meta: {
      title: '小程序管理',
      icon: 'el-icon-s-order'
    },
    children: [{
      path: 'banner',
      name: 'banner',
      component: () => import('@/views/applet/banner/index'),
      meta: {
        title: 'banner管理'
        // icon: 'income'
      }
    },
    {
      path: 'tickets',
      name: 'tickets',
      component: () => import('@/views/applet/tickets/index'),
      meta: {
        title: '特惠门票管理'
        // icon: 'income'
      }
    },
    {
      path: 'travelNotes/list',
      name: 'travelNotes',
      component: () => import('@/views/applet/travelNotes/list'),
      meta: { title: '游记攻略' }
    },
    {
      path: 'travelNotes/add',
      name: 'travelNotes-add',
      component: () => import('@/views/applet/travelNotes/save'),
      meta: { title: '添加游记攻略', activeMenu: '/applet/travelNotes/list' },
      hidden: true
    },
    {
      path: 'travelNotes/:detailId(\\d+)',
      name: 'travelNotes-detail',
      component: () => import('@/views/applet/travelNotes/save'),
      meta: { title: '游记攻略详情', activeMenu: '/applet/travelNotes/list' },
      hidden: true
    },
    {
      path: 'travelNotes/:id(\\d+)/edit',
      name: 'travelNotes-edit',
      component: () => import('@/views/applet/travelNotes/save'),
      meta: { title: '编辑游记攻略', activeMenu: '/applet/travelNotes/list' },
      hidden: true
    },
    {
      path: 'course/list',
      name: 'course',
      component: () => import('@/views/applet/course/list'),
      meta: { title: '精选路线' }
    },
    {
      path: 'informationClass',
      name: 'informationClass',
      component: () => import('@/views/applet/informationClass/index'),
      meta: {
        title: '资讯类管理'
        // icon: 'income'
      }
    },
    {
      path: 'destination',
      name: 'destination',
      component: () => import('@/views/applet/destination/index'),
      meta: {
        title: '目的地管理'
        // icon: 'income'
      }
    },
    // {
    //   path: 'shoppingMall',
    //   name: 'shoppingMall',
    //   component: () => import('@/views/applet/shoppingMall/index'),
    //   meta: {
    //     title: '商城管理'
    //     // icon: 'income'
    //   }
    // },
    {
      path: 'cate',
      name: 'cate',
      component: () => import('@/views/applet/cate/index'),
      meta: {
        title: '美食'
        // icon: 'income'
      }
    },
    {
      path: 'specialty',
      name: 'specialty',
      component: () => import('@/views/applet/specialty/index'),
      meta: {
        title: '美食特产'
        // icon: 'income'
      }
    },
    {
      path: 'choiceness',
      name: 'choiceness',
      component: () => import('@/views/applet/choiceness/index'),
      meta: {
        title: '五区精选'
        // icon: 'income'
      }
    },
    {
      path: 'recommend',
      name: 'recommend',
      component: () => import('@/views/applet/recommend/index'),
      meta: {
        title: '热门推荐'
        // icon: 'income'
      }
    },
    {
      path: 'aid',
      name: 'aid',
      component: () => import('@/views/applet/aid/index'),
      meta: {
        title: '帮助中心'
        // icon: 'income'
      }
    },
    {
      path: 'appletNumber',
      name: 'appletNumber',
      component: () => import('@/views/applet/appletNumber/index'),
      meta: {
        title: '投诉/联系电话'
        // icon: 'income'
      }
    }
      // {
      //   path: 'convention',
      //   name: 'convention',
      //   component: () => import('@/views/applet/convention/index'),
      //   meta: {
      //     title: '文旅大会管理',
      //     // icon: 'income'
      //   }
      // },
    ]
  },
  {
    path: '/convention',
    component: Layout,
    // redirect: '/applet/commentAudit',
    name: 'convention',
    meta: {
      title: '文旅大会管理',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'bannerConvention',
        name: 'bannerConvention',
        component: () => import('@/views/convention/bannerConvention/index'),
        meta: {
          title: 'banner管理'
          // icon: 'income'
        }
      },
      {
        path: 'informationConvention',
        name: 'informationConvention',
        component: () => import('@/views/convention/informationConvention/index'),
        meta: {
          title: '大会资讯'
          // icon: 'income'
        }
      },
      {
        path: 'handbook',
        name: 'handbook',
        component: () => import('@/views/convention/handbook/index'),
        meta: {
          title: '正式代表手册'
          // icon: 'income'
        }
      },
      {
        path: 'distinguishedGuestBook',
        name: 'distinguishedGuestBook',
        component: () => import('@/views/convention/distinguishedGuestBook/index'),
        meta: {
          title: '特邀嘉宾手册(停用)'
          // icon: 'income'
        }
      },
      {
        path: 'liveStreamingConvention',
        name: 'liveStreamingConvention',
        component: () => import('@/views/convention/liveStreamingConvention/index'),
        meta: {
          title: '大会直播'
          // icon: 'income'
        }
      },
      {
        path: 'imageText',
        name: 'imageText',
        component: () => import('@/views/convention/imageText/index'),
        hidden: true,
        meta: {
          title: '图文直播'
          // icon: 'income'
        }
      },
      {
        path: 'graphicManagement/:id',
        name: 'graphicManagement',
        component: () => import('@/views/convention/liveStreamingConvention/components/graphicManagement'),
        hidden: true,
        meta: {
          title: '图文管理'
          // icon: 'income'
        }
      },
      {
        path: 'announcement',
        name: 'announcement',
        component: () => import('@/views/convention/announcement/index'),
        meta: {
          title: '公告管理'
          // icon: 'income'
        }
      },
      {
        path: 'helpConvention',
        name: 'helpConvention',
        component: () => import('@/views/convention/helpConvention/index'),
        meta: {
          title: '帮助中心'
          // icon: 'income'
        }
      },
      {
        path: 'contactNumber',
        name: 'contactNumber',
        component: () => import('@/views/convention/contactNumber/list'),
        meta: {
          title: '联系电话'
          // icon: 'income'
        }
      },
      {
        path: 'aboutUs',
        name: 'aboutUs',
        component: () => import('@/views/convention/aboutUs/index'),
        meta: {
          title: '关于我们'
          // icon: 'income'
        }
      },
      {
        path: 'userAgreement',
        name: 'userAgreement',
        component: () => import('@/views/convention/userAgreement/index'),
        meta: {
          title: '用户协议'
          // icon: 'income'
        }
      },
      {
        path: 'inspectionPoint',
        name: 'inspectionPoint',
        component: () => import('@/views/convention/inspectionPoint/index'),
        meta: {
          title: '考察点管理'
          // icon: 'income'
        }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'userManage',
      name: 'userManageIndex',
      component: () => import('@/views/userManage/index'),
      meta: {
        title: '用户管理',
        icon: 'el-icon-s-help'
      }
    }]

  },
  {
    path: '/merchantManage',
    component: Layout,
    name: 'merchantManage',
    meta: {
      title: '商家管理',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'merchantManage',
      name: 'merchantManageIndex',
      component: () => import('@/views/merchantManage/index'),
      meta: {
        title: '商家管理',
        icon: 'el-icon-s-help'
      }
    },
    {
      path: 'index',
      name: 'temporary',
      component: () => import('@/views/temporary/index'),
      hidden: true,
      meta: {
        title: '新增商家',
        icon: 'el-icon-s-help'
      }
    }
    ]
  },
  {
    path: '/informationPush',
    component: Layout,
    name: 'informationPush',
    meta: {
      title: '信息推送',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'informationPush',
      name: 'informationPushIndex',
      component: () => import('@/views/informationPush/index'),
      meta: {
        title: '信息推送',
        icon: 'el-icon-s-help'
      }
    }]
  },
  {
    path: '/liveStreaming',
    component: Layout,
    name: 'liveStreaming',
    meta: {
      title: '直播管理',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'liveStreaming',
      name: 'liveStreamingIndex',
      component: () => import('@/views/liveStreaming/index'),
      meta: {
        title: '直播管理',
        icon: 'el-icon-s-help'
      }
    }]
  },
  {
    path: '/complain',
    component: Layout,
    name: 'complain',
    meta: {
      title: '投诉管理',
      icon: 'el-icon-s-help'
    },
    children: [{
      path: 'complain',
      name: 'complainIndex',
      component: () => import('@/views/complain/index'),
      meta: {
        title: '投诉管理',
        icon: 'el-icon-s-help'
      }
    }]
  }
  // 404 页面必须放在最后  必须放在异步路由结尾，如果在放在constantRoutes后面  则刷新页面时还未生成动态路由会提前匹配到
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
