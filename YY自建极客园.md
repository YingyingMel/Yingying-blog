

### YY自建极客园

1. 

2. yarn add antd

3. 调整项目目录结构

   ```bash
   /src
     /assets         项目资源文件，比如，图片 等
     /components     通用组件
     /pages          页面
     /store          mobx 状态仓库
     /utils          工具，比如，token、axios 的封装等
     App.js          根组件
     index.css       全局样式
     index.js        项目入口
   ```

4. yarn start

5. 在根目录index.js里 import 'antd/dist/antd.min.css'， 在app.js 里引入一个button，如果是蓝色的，说明antd引入成功

   ```
   import React from 'react';
   import { Button } from 'antd';
   import './App.css';
   
   const App = () => (
     <div className="App">
       <Button type="primary">Button</Button>
     </div>
   );
   
   export default App;
   ```

   

6. 安装解析 sass 的包：`yarn add sass -D`把根组件的css样式文件改成：`index.scss`

   ```scss
   body {
     margin: 0;
   }
   
   #root {
     height: 100%;
   }
   ```

7. 配置基础路由

   7. 1. 安装路由：`yarn add react-router-dom`
      2. 创建page 文件夹，在 pages 目录中创建两个文件夹：Login、Layout
      3. 分别在两个目录中创建 index.js 文件，并创建一个简单的组件后导出

      ![image-20220524160956968](C:\Users\yingy\AppData\Roaming\Typora\typora-user-images\image-20220524160956968.png)

      4. 在 App.js 中，导入路由组件以及两个页面组件
      5. 配置 Login 和 Layout 的路由规则

   `app.js`

   ```jsx
   // 导入路由
   import { BrowserRouter, Route, Routes } from 'react-router-dom'
   
   // 导入页面组件
   import Login from './pages/Login'
   import Layout from './pages/Layout'
   
   // 配置路由规则
   function App() {
     return (
       <BrowserRouter>
         <div className="App">
          <Routes>
               <Route path="/" element={<Layout/>}/>
               <Route path="/login" element={<Login/>}/>
           </Routes>
         </div>
       </BrowserRouter>
     )
   }
   
   export default App
   ```

8. 