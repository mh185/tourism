import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getKey } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
})
service.interceptors.request.use(
  config => {
    if (config.port) {
      // config.baseURL = `${config.baseURL}-${config.port}`
      // config.baseURL = `${config.baseURL}:${config.port}`
    }
    if (store.getters.token) {
      config.headers[getKey()] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    const { responseType } = response.config
    if (['arraybuffer', 'blob', 'stream'].some(v => v === responseType)) {
      return response
    }
    if (res.code === 200) {
      return res
    } else {
      console.log(res)
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: 非法登录; 50012: 其他客户端登录; 50014: 登录过期;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('您已注销，您可以取消停留在此页，或重新登录', '确认注销', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    console.log('err', error) // for debug
    if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
      Message({
        message: '连接超时,请稍后重试！',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
