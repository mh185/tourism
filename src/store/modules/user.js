import { login, getInfo, getRoute } from '@/api/user'
import { getToken, setToken, removeToken, getKey, setKey, removeKey } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  key: getKey(),
  introduction: '',
  roles: []
}

const mutations = {
  SET_KEY: (state, key) => {
    state.key = key
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        setKey(data.key)
        setToken(data.token)
        commit('SET_KEY', data.key)
        commit('SET_TOKEN', data.token)
        localStorage.setItem('pages', '')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户基础信息
  getInfo({ commit, state }) {
    const formData = {
      token: state.token
    }
    return new Promise((resolve, reject) => {
      getInfo(formData).then(response => {
        const { userInfo, menus } = response.data
        if (!userInfo) {
          reject('验证失败，请重新登录.')
        }
        const { username, headUrl } = userInfo
        commit('SET_NAME', username)
        commit('SET_AVATAR', headUrl)
        let roles = menus
        roles = ['admin']

        // console.log(roles)
        if (!roles) {
          reject('验证失败，请重新登录.')
        }
        if (!roles || roles.length <= 0) {
          reject('getRoute: 角色权限必须是非空数组!')
        }
        commit('SET_ROLES', roles)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户登出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeKey()
      removeToken()
      resetRouter()
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getRoute')
      console.log(roles)
      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
