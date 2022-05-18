//统一所有的stroe到这个根store, 套模板写
import React from "react"
import LoginStore from "./login.Store"
import UserStore from "./user.Store"
import ChannelStore from "./channel.Store"

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new ChannelStore()
    //...再导入其他store
  }
}

//实例化RootStore
//导出useStore context

const rootStore = new RootStore()
const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export { useStore }