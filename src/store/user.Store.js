import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'

class UserStore {
  userInfo = {}
  constructor() {
    //响应式
    makeAutoObservable(this)
  }

  getUserInfo = async () => {
    //调用接口获取user信息
    const res = await http.get('my/userinfo')
    //console.log(res)
    this.userInfo = res.data
  }
}

export default UserStore