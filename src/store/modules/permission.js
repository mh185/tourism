import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 使用meta.role确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
// const flatten = arr => arr.reduce(
//   (acc, item) => acc.concat(Array.isArray(item.children) ? flatten(item.children) : item.children), []
// )
// export function recursionRoutes(routes) { //所有路由，roles用户所有路由 //将多级路由遍历为一层
//   const res = []
//   recursion(routes)
//   function recursion(routes) {//针对返回路由为树形结构的处理，将其转换为最底层数据的集合
//     routes.forEach(route => {
//       const tmp = { ...route }
//       if (tmp.children && tmp.children.length > 0) {
//         recursion(tmp.children)
//       }else{ //这里输出最底层children
//         // res.push(tmp)
//       }
//       res.push(tmp)
//     })
//   }
//   return res
// }

// /**
//  * 递归过滤异步路由表
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) { //
//   const funRoutes = roles.filter(item=>item.type == 2)//所有三级按钮集合
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     let flag = roles.some(role=> {
//       if(role.path == tmp.name){
//         tmp.meta.funs = funRoutes.filter(item=>item.parentId == role.id)
//         tmp.menuIndex = role.menuIndex  //排序的值
//         delete tmp.meta.svg
//         tmp.meta.icon = role.menuIcon
//         return true
//       }

//     })
//     if (flag) {
//       if (tmp.children) {
//         tmp.children.sort(compare("menuIndex"))
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }

//   })
//   return res
// }
function compare(p) { // 这是比较函数
  return function(m, n) {
    var a = m[p]
    var b = n[p]
    return a - b // 升序
  }
}

// /**
//  * 递归过滤异步路由表
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) { //所有路由，roles用户所有路由
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

// /**
//  * 递归过滤异步路由表
//  * @param routes asyncRoutes
//  * @param roles
//  */
export function filterAsyncRoutes(routes, roles) { // 所有路由，roles用户所有路由
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    const flag = roles.some(role => {
      // console.log('循环',role.path, tmp.name)
      if (role.path == tmp.name) {
        tmp.menuIndex = role.menuIndex // 排序的值
        if (tmp.meta && tmp.meta.svg) {
          delete tmp.meta.svg
        }
        if (role.menuIcon) {
          tmp.meta = {}
          tmp.meta.icon = role.menuIcon
        }
        return true
      }
    })
    if (flag) {
      if (tmp.children) {
        tmp.children.sort(compare('menuIndex'))
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    } else if (route.path === '*') { // 全局匹配除外
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [], // 总路由
  addRoutes: [] // 当前角色可访问的路由
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 生成路由
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, recursionRoutes(roles)) //所有路由，roles用户所有路由
  //       accessedRoutes.sort(compare("menuIndex"))
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        console.log('开始处理路由', asyncRoutes, roles)
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        console.log('路由处理结束', accessedRoutes)
        accessedRoutes.sort(compare('menuIndex'))
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
