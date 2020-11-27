import request from '@/utils/request'

export const pageQuery = (param, data) => request({
  url: `/observationPoint/v1/pageQuery`,
  method: 'post',
  params: param,
  data: data
})

export const queryObservationScenicSpotList = (data) => request({
  url: `/scenicSpot/v1/queryObservationScenicSpotList`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/observationPoint/v1/delete`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/observationPoint/v1/insert`,
  method: 'post',
  data: data
})

export const updateVO = (data) => request({
  url: `/observationPoint/v1/updateVO`,
  method: 'post',
  data: data
})
