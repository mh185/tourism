import request from '@/utils/request'

export const select = (params) => request({
  url: `/about/v1/select`,
  method: 'post',
  params: params,
})

export const deleteId = (params) => request({
  url: `/about/v1/delete`,
  method: 'post',
  params: params,
})

export const update = (params,data) => request({
  url: `/about/v1/update`,
  method: 'post',
  params: params,
  data: data
})

export const insert = (params,data) => request({
  url: `/about/v1/insert`,
  method: 'post',
  params: params,
  data: data
})