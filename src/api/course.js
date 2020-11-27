import request from '@/utils/request'

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/selectedRoutes/v1/insert`,
  method: 'post',
  data: data
})

// 查询旅行社
export const pageQuery = (params, data) => request({
  url: `/travelAgents/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})

// 查询路线
export const pageQueryTwo = (params, data) => request({
  url: `/routesType/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})

export const deleteId = (params) => request({
  url: `/selectedRoutes/v1/delete`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/selectedRoutes/v1/update`,
  method: 'post',
  data: data
})
