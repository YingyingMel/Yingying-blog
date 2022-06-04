import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

//把所有children组件，当做参数传入AuthComponent中
const AuthRoute = ({ children }) => {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace={true} />
  }
}

export { AuthRoute }