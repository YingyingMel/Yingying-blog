//封装axios
//实例化，请求拦截器，响应拦截器

import axios from 'axios'
import { getToken, removeToken } from './token'
import { history } from './history'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  //把本地token加入请求头,以后不论get还是post请求，token都会被加入
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.dir(error)// 通过打印错误对象可以看到错误状态码，401表示Token失效
  if (error.response.status === 401) {
    //跳回登录页面，ReactRouter默认状态下，不支持在组件之外完成路由跳转
    //需要自己手动实现,可以根据讲义配置，方法一
    removeToken()
    history.push('./login')

    //或者用下面的方法，方法二
    // 1. 删除token
    //removeToken()
    // 2. 跳转到登录页
    //window.location.href = '/login'
  }
  return Promise.reject(error)
})

export { http }