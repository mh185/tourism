import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/proclamation/v1/pageQuery`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/proclamation/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/proclamation/v1/delete`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/proclamation/v1/update`,
  method: 'post',
  data: data
})
