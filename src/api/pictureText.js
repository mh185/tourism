import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/imageLive/v1/pageQuery`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/imageLive/v1/insert`,
  method: 'post',
  data: data
})

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/imageLive/v1/delete`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/imageLive/v1/update`,
  method: 'post',
  data: data
})
