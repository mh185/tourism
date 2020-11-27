import request from '@/utils/request' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块
// 查找
export const getManagerList = (param) => request({
  url: '/deliciousFood/v1/getManagerList',
  method: 'post',
  params: param
})

export const deleteCate = (param) => request({
  url: '/deliciousFood/v1/delete',
  method: 'post',
  params: param
})

export const pageQueryByCityCode = (params) => request({
  url: `/regionAreas/v1/pageQueryByCityCode`,
  method: 'post',
  params: params
})
// 新增
export const insertCate = (param) => request({
  url: '/deliciousFood/v1/insert',
  method: 'post',
  data: param
})

// 添加
export const updateCate = (param) => request({
  url: '/deliciousFood/v1/update',
  method: 'post',
  data: param
})
