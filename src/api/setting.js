import request from '@/utils/request'
export const getRoleList = (params, data) => request({
  url: `/role/v1/pageQuery`,
  method: 'post',
  params, data
})
export const addRole = (params, data) => request({
  url: `/role/v1/insert`,
  method: 'post',
  params, data
})

export const getMenuList = (params, data) => request({
  url: `/menu/v1/pageQuery`,
  method: 'post',
  params, data
})

