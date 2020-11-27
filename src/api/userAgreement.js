import request from '@/utils/request'

export const select = (params) => request({
  url: `/userAgreement/v1/select`,
  method: 'post',
  params: params
})

export const update = (params) => request({
  url: `/userAgreement/v1/update`,
  method: 'post',
  params: params
})

export const insert = (params) => request({
  url: `/userAgreement/v1/insert`,
  method: 'post',
  params: params
})

export const deleteId = (params) => request({
  url: `/userAgreement/v1/delete`,
  method: 'post',
  params: params
})
