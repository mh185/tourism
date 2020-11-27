import request from '@/utils/request'

export const upfiles = (data) => request({
  url: '/fileManage/v1/insert/upload',
  method: 'post',
  data: data
})

export const insert = (data) => request({
  url: `/travels/v1/insert`,
  method: 'post',
  data: data
})

export const update = (data) => request({
  url: `travels/v1/update`,
  method: 'post',
  data: data
})
