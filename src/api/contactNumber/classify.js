import request from '@/utils/request'

// 文旅分类
export const pageQueryClass = (params, data) => request({
  url: `/contactType/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})

export const insert = (data) => request({
  url: `/contactType/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/contactType/v1/delete`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/contactType/v1/update`,
  method: 'post',
  data: data
})
