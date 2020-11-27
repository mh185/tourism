import request from '@/utils/request'

export const pageQuery = (params, data) => request({
  url: `/newsReport/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})

export const selectOne = (params) => request({
  url: `/newsReport/v1/selectOne`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/newsReport/v1/update`,
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/newsReport/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/newsReport/v1/delete`,
  method: 'post',
  params: params
})

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})
