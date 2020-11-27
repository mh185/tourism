import request from '@/utils/request'

export const pageQuery = (param, data) => request({
  url: `/topScenicSpot/v1/pageQuery`,
  method: 'post',
  params: param,
  data: data
})

// 查询所有景区 -- 新增五区精选下拉框列表选择
export const queryTopScenicSpotList = (data) => request({
  url: `/scenicSpot/v1/queryTopScenicSpotList`,
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/topScenicSpot/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/topScenicSpot/v1/delete`,
  method: 'post',
  params: params
})

export const updateVO = (data) => request({
  url: `/topScenicSpot/v1/updateVO`,
  method: 'post',
  data: data
})
