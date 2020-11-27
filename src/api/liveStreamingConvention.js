import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/meetingLive/v1/pageQuery`,
  method: 'post',
  params: params
})

export const deleteId = (params) => request({
  url: `/meetingLive/v1/delete`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/meetingLive/v1/insert`,
  method: 'post',
  data: data
})

export const update = (data) => request({
  url: `/meetingLive/v1/update`,
  method: 'post',
  data: data
})

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})

export const findById = (params) => request({
  url: `/fileManage/v1/findById`,
  method: 'post',
  params: params
})
