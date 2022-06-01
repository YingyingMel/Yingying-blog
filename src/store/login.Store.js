//login module
import { makeAutoObservable } from 'mobx'
import { http, setToken, getToken, removeToken } from '@/utils'

class LoginStore {
  token = getToken() || '' //初始化的时候优先从本地取，取不到再初始化为空值
  constructor() {
    //响应式
    makeAutoObservable(this)
  }

  //登录
  getToken = async ({ mobile, code }) => {
    //调用登录接口
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    //存入token
    this.token = res.data.token //从服务器获得token
    //存入localstorage
    setToken(this.token)
  }

  //退出，删除token
  loginOut = () => {
    this.token = "" //清空token值
    removeToken() //删除localstorage里的token
  }

}

export default LoginStore