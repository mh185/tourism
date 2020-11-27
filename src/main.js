import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/directive/loadmore'
import '@/styles/public.scss' // global css

// 富文本
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import common from './common'
Vue.prototype.$common = common

import App from './App'
import store from './store'
import router from './router'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
// import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.component('pagination', Pagination)

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

Vue.prototype.axios = request

// Vue.use( CKEditor )

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'kZsGlNC2NVnBZC0G9UhwjMgtpHR1ERl3'
})
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
