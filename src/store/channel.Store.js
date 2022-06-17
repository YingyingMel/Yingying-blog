import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'

class ChannelStore {
  channelList = []
  constructor() {
    //响应式
    makeAutoObservable(this)
  }
  ////频道列表管理，article和publish都要用到
  //获取频道列表, 因为layout页面用{ observer } from 'mobx-react-lite'与store绑定，要记得去layout页面导入,并放入useEffect首次加载中
  loadChannelList = async () => {
    const res = await http.get('/my/channels')
    //console.log(res) //查看res的结构，提取需要的数据
    this.channelList = res.data.data
  }
}

export default ChannelStore

