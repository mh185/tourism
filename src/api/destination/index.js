import request from '@/utils/request' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块
//查找
export const queryDestination = (param, data) => request({
  url: '/destination/v1/pageQuery',
  method: 'post',
  params: param,
  data: data
})

//删除
export const delDestination = (param) => request({
  url: '/destination/v1/delete',
  method: 'post',
  params: param,
})

//添加
export const insertDestination = (param) => request({
  url: '/destination/v1/insert',
  method: 'post',
  data: param,
})


//查询所有景区

export const queryScenicSpotList = () => request({
  url:'/scenicSpot/v1/queryDestinationScenicSpotList',
  method:'post'
})