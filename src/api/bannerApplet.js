import request from '@/utils/request'

export const pageQuery = (params) => request({
  url: `/banner/v1/pageQuery`,
  method: 'post',
  params: params
})

export const deleteId = (params) => request({
  url: `/banner/v1/delete`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/banner/v1/insert`,
  method: 'post',
  data: data
})

export const update = (data) => request({
  url: `/banner/v1/update`,
  method: 'post',
  data: data
})

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})
// 上传视频
export const uploadVideos = (data) => request({
  url: '/scenicSpot/v1/uploadVideos',
  method: 'post',
  data: data
})

// 跳转内部内容 - 关联内容
// 景区
export const queryHotScenicSpotList = () => request({
  url: `/scenicSpot/v1/queryHotScenicSpotList`,
  method: 'post'
})
// 美食
export const getManagerList = (params) => request({
  url: `/deliciousFood/v1/getManagerList`,
  method: 'post',
  params: params
})
// 美食特产
export const pageQuerySpecialty = (params) => request({
  url: `/gourmetSpecialty/v1/miniApp/pageQuery`,
  method: 'post',
  params: params
})
// 游记攻略
export const pageQueryTravel = (params, data) => request({
  url: `/travels/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})
// 精品路线
export const pageQueryPath = (params, data) => request({
  url: `/selectedRoutes/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data
})
