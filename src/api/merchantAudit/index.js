import request from '@/utils/request' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

export const queryVerifyInfo = (param, data) => request({
  url: '/business/v1/queryVerifyInfo',
  method: 'post',
  params: param,
  data: data
})
