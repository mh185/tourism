import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/contact/v1/pageQuery`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/contact/v1/update`,
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/contact/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/contact/v1/delete`,
  method: 'post',
  params: params
})
// 下拉框
export const queryAll = (params) => request({
  url: `/contactType/v1/queryAll`,
  method: 'post',
  params: params
})
