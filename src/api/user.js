import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/v1/system',
    method: 'post',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/token/v1/pc/getUserInfo',
    method: 'post'
  })
}

export function getRoute() {
  return request({
    url: 'userInfo/v1/selectUserMenu',
    port: 'security',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
