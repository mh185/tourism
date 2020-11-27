import request from '@/utils/request';

//查询商家
export function getBusinessList(data,query) {
    return request({
      url: '/business/v1/pageQuery',
      method: 'post',
      params: data,
      data:query
    })
  }

  //是否启用商家 /business/v1/stopOrStart

  export function stopOrStart(data) {
    return request({
      url: '/business/v1/stopOrStart',
      method: 'post',
      params: data
    })
  }