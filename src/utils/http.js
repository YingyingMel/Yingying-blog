import axios from 'axios'
import { getToken, removeToken } from './token'
import { history } from './history'

//请求后端的baseURL
const http = axios.create({
  baseURL: 'https://blog-yy-server.herokuapp.com',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  //把本地token加入请求头
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
  return response
}, (error) => {
  console.dir(error)
  if (error.response.status === 401) {
    //跳回登录页面，ReactRouter默认状态下，不支持在组件之外完成路由跳转
    removeToken()
    history.push('./login')
  }
  return Promise.reject(error)
})

export { http }