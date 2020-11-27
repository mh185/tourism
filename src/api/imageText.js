import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/imageTextLive/v1/pageQuery`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/imageTextLive/v1/insert`,
  method: 'post',
  data: data
})

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/imageTextLive/v1/delete`,
  method: 'post',
  params: params
})

export const update = (data) => request({
  url: `/imageTextLive/v1/update`,
  method: 'post',
  data: data
})
// 第二层
export const getInfoById = (params) => request({
  url: `/imageTextLive/v1/getInfoById`,
  method: 'post',
  params: params
})
// 新增图文直播内容
export const insertImageTextLiveContent = (data) => request({
  url: `/imageTextLive/v1/insertImageTextLiveContent`,
  method: 'post',
  data: data
})
// 删除图文直播内容
export const deleteImageTextLiveContent = (params) => request({
  url: `/imageTextLive/v1/deleteImageTextLiveContent`,
  method: 'post',
  params: params
})
// 修改图文直播内容
export const updateImageTextLiveContent = (data) => request({
  url: `/imageTextLive/v1/updateImageTextLiveContent`,
  method: 'post',
  data: data
})
