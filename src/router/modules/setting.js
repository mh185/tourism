/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const settingRouter = {
  path: '/setting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Setting',
  meta: {
    title: '系统设置',
    icon: 'el-icon-setting'
  },
  children: [
    {
      path: 'role/list',
      component: () => import('@/views/setting/role/list'),
      name: 'Setting-role-list',
      meta: { title: '角色管理', noCache: true }
    },
    {
      path: 'role/:id(\\d+)/permission',
      component: () => import('@/views/setting/role/permission'),
      name: 'Setting-role-permission',
      meta: { title: '角色权限', activeMenu: '/setting/role', activeMenu: '/setting/role/list' },
      hidden: true
    },
    {
      path: 'menu/list',
      component: () => import('@/views/setting/menu/list'),
      name: 'Setting-menu-list',
      meta: { title: '菜单管理', noCache: true }
    },
    {
      path: 'permission/list',
      component: () => import('@/views/setting/permission/list'),
      name: 'Setting-permission-list',
      meta: { title: '权限管理', noCache: true }
    },
    {
      path: 'permission/:id(\\d+)/menu',
      component: () => import('@/views/setting/permission/menu'),
      name: 'Setting-permission-menu',
      meta: { title: '权限菜单', noCache: true, activeMenu: '/setting/permission/list' },
      hidden: true
    },
    {
      path: 'user/list',
      component: () => import('@/views/setting/user/list'),
      name: 'Setting-user-list',
      meta: { title: '用户管理', noCache: true }
    },
    {
      path: 'user/add',
      component: () => import('@/views/setting/user/save'),
      name: 'Setting-user-add',
      meta: { title: '新建用户', noCache: true, activeMenu: '/setting/user/list' },
      hidden: true
    },
    {
      path: 'user/:id(\\d+)/edit',
      component: () => import('@/views/setting/user/save'),
      name: 'Setting-user-edit',
      meta: { title: '编辑用户', noCache: true, activeMenu: '/setting/user/list' },
      hidden: true
    }
  ]
}

export default settingRouter
