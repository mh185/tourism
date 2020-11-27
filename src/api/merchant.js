import request from '@/utils/request'

export const pageQuery = (params, data) => request({
  url: `/business/v1/pageQuery`,
  method: 'post',
  params: params,
  data: data,
})

export const IsEnableAccount = (params) => request({
  url: `/business/v1/IsEnableAccount`,
  method: 'post',
  params: params,
})

export const selectOne = (params) => request({
  url: `/business/v1/selectOne`,
  method: 'post',
  params: params,
})
