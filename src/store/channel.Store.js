import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'

class ChannelStore {
  channelList = []
  constructor() {
    //响应式
    makeAutoObservable(this)
  }
  ////频道列表管理，article和publish都要用到
  loadChannelList = async () => {
    const res = await http.get('/channels')
    //console.log(res) //看channels接口里有什么内容
    this.channelList = res.data.channels
  }
}

export default ChannelStore

