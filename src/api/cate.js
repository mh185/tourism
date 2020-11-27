import request from '@/utils/request'

export const pageQuery = (params) =>request({
  url: `/deliciousFood/v1/miniApp/pageQuery`,
  method: 'post',
  params: params,
})

export const deleteCate = (params) =>request({
  url: `/deliciousFood/v1/delete`,
  method: 'post',
  params: params,
})

export const pageQueryByCityCode = (params) =>request({
  url: `/regionAreas/v1/pageQueryByCityCode`,
  method: 'post',
  params: params,
})