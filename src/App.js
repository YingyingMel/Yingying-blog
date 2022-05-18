import { unstable_HistoryRouter as Router, Routes, Route } from 'react-router-dom'
import { history } from './utils/history'
import { AuthComponent } from "./components/AuthComponent"
import './App.css'
import { lazy, Suspense } from 'react'

//使用路由懒加载，下面这些原来引入的组件要改写
// import Home from './pages/home'
// import Article from './pages/article'
// import Publish from './pages/publish'
// import Login from '@/pages/login'
// import LayoutPage from '@/pages/layout'

// 按需导入路由组件
const Login = lazy(() => import('./pages/login'))
const LayoutPage = lazy(() => import('./pages/layout'))
const Home = lazy(() => import('./pages/home'))
const Article = lazy(() => import('./pages/article'))
const Publish = lazy(() => import('./pages/publish'))


function App () {
  return (
    //路由配置
    <Router history={history}>
      <div className="App">
        <Suspense    //使用 Suspense 组件包裹组件内容
          fallback={  //为 Suspense 组件提供 fallback 属性，指定 loading 占位内容
            <div
              style={{
                textAlign: 'center',
                marginTop: 200
              }}
            >
              loading...
            </div>
          }
        >
          <Routes>
            {/* Layout需要用{ AuthComponent }来进行鉴权处理，要根据登录状态来判断是否渲染 */}
            <Route path='/' element={
              <AuthComponent>
                <LayoutPage />
              </AuthComponent>
            }>
              <Route index element={<Home />}></Route>
              <Route path='/article' element={<Article />}></Route>
              <Route path='/publish' element={<Publish />}></Route>
            </Route>
            <Route path='/login' element={<Login />}></Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
