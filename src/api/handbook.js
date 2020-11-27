import request from '@/utils/request'

export const getMeetingManual = () => request({
  url: `/meetingManual/v1/miniApp/getMeetingManual`,
  method: 'post'
})

export const update = (data) => request({
  url: `/meetingManual/v1/update`,
  method: 'post',
  data: data
})

export const deleteId = (params) => request({
  url: `/meetingManual/v1/delete`,
  method: 'post',
  params: params
})

export const insert = (data) => request({
  url: `/meetingManual/v1/insert`,
  method: 'post',
  data: data
})
