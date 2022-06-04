import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  ContactsOutlined,
  BookOutlined,
  CarryOutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'

const { Header, Sider } = Layout

const items = [
  { label: (<Link to='/'>Home</Link>), icon: <HomeOutlined />, key: '/' },
  {
    label: (<Link to='/article'>Diary</Link>), icon: <BookOutlined />, key: 'sub1', children:
      [
        { label: (<Link to='/article'>Diary List</Link>), icon: <DiffOutlined />, key: '/article' },
        { label: (<Link to='/publish'>Publish a diary</Link>), icon: <EditOutlined />, key: '/publish' }
      ]
  },
  { label: (<Link to='/todolist'>To-do-List</Link>), icon: <CarryOutOutlined />, key: '/todolist' },
  { label: (<Link to='/movieland'>MovieLand</Link>), icon: <VideoCameraOutlined />, key: '/movieland' },
  { label: (<Link to='/about'>Contact me</Link>), icon: <ContactsOutlined />, key: '/about' },
]


const LayoutPage = () => {
  const { pathname } = useLocation()
  const { userStore, loginStore, channelStore } = useStore()

  //获取用户数据，加载频道列表
  useEffect(() => {
    try {
      userStore.getUserInfo()
      channelStore.loadChannelList()
    } catch { }
  }, [userStore, channelStore])

  //确认退出
  const navigate = useNavigate()
  const onConfirm = () => {
    //退出登录 删除token, 跳回到登录
    loginStore.loginOut()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="Are you sure to logout?"
              okText="yes"
              cancelText="cancle"
              onConfirm={onConfirm}>
              <LogoutOutlined /> Logout
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          className="site-layout-background"
          breakpoint="lg"
          collapsedWidth="0"
        // onBreakpoint={(broken) => {
        //   console.log(broken)
        // }}
        // onCollapse={(collapsed, type) => {
        //   console.log(collapsed, type)
        // }}
        >
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          >

          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(LayoutPage)
