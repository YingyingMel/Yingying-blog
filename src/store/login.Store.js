//login module
import { makeAutoObservable } from 'mobx'
import { http, setToken, getToken, removeToken } from '@/utils'

class LoginStore {
  token = getToken() || '' //刷新时有token就取值，没有就是空字符串
  constructor() {
    //响应式
    makeAutoObservable(this)
  }


  getToken = async ({ mobile, code }) => {
    //调用登录接口
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    //存入token
    this.token = res.data.token
    //存入localstorage
    setToken(this.token)
  }

  //删除token
  loginOut = () => {
    this.token = "" //清空token值
    removeToken() //删除localstorage里的token
  }

}

export default LoginStore