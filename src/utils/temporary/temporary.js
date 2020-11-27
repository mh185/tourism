import request from '../request' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

export const getCityCode = (data) => request({
  url: '/regionAreas/v1/pageQueryByCityCode',
  method: 'post',
  params: data
})

// 新增
export const insertScenic = (data) => request({
  url: '/scenicSpot/v1/insert',
  method: 'post',
  data: data
})
// 修改
export const updateScenic = (data) => request({
  url: '/scenicSpot/v1/update',
  method: 'post',
  data: data
})
export const getSpotinfo = (data) => request({
  url: '/scenicSpot/v1/queryScenicSpotInfo',
  method: 'post',
  params: data
})

export const delStop = (data) => request({
  url: '/scenicSpot/v1/delete',
  method: 'post',
  params: data
})
// 上传文件
export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})
// 上传图片
export const uploadPictures = (data) => request({
  url: '/scenicSpot/v1/uploadPictures',
  method: 'post',
  data: data
})
// 上传视频
export const uploadVideos = (data) => request({
  url: '/scenicSpot/v1/uploadVideos',
  method: 'post',
  data: data
})
// 删除图片
export const delPictures = (data) => request({
  url: '/scenicSpot/v1/deletePictures',
  method: 'post',
  params: data
})

// 上传logo
export const changeLogoPicture = (data) => request({
  url: '/scenicSpot/v1/changeLogoPicture',
  method: 'post',
  params: data
})
