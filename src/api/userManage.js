import request from '@/utils/request'

export function pageQueryAddress(params) {
  return request({
    url: '/userAddress/v1/pageQueryAddress',
    method: 'post',
    params
  })
}
