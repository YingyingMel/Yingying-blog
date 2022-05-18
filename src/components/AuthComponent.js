//1. 判断Token是否存在
//2. 如果存在，则正常渲染
//3. 如果不存在，重定向到登录页面

//高阶组件：把一个组件当成参数传入另一组件中
//然后通过一定的判断，返回新的组件

import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

const AuthComponent = ({ children }) => {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace />
  }
}

//例如： <AuthComponent> <layout /> </AuthComponent>
//如果有token,判断为登录状态，则渲染首页Layout: <><layout /></>
//如果没有token，为非登录状态，重定向到登录页面：<Navigate to="/login" replace/>

export { AuthComponent }