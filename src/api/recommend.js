import request from '@/utils/request'

export const pageQuery = (param, data) => request({
  url: `/hotScenicSpot/v1/pageQuery`,
  method: 'post',
  params: param,
  data: data
})

export const queryHotScenicSpotList = (data) => request({
  url: `/scenicSpot/v1/queryHotScenicSpotList`,
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/hotScenicSpot/v1/insert`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/hotScenicSpot/v1/delete`,
  method: 'post',
  params: params
})

export const updateVO = (data) => request({
  url: `/hotScenicSpot/v1/updateVO`,
  method: 'post',
  data: data
})
