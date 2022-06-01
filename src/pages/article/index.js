import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import 'moment/locale/zh-cn' //无需安装，直接引入
import locale from 'antd/es/date-picker/locale/zh_CN' //无需安装，直接引入
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import './index.scss'
import { http } from '@/utils'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {

  //表格columns结构,是根据后端的文档数据设置的
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: cover => { //下面src地址要根据后端返回数据提取url
        return <img src={cover.images[0] || img404} width={200} height={150} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {//对于action,有两种方案，1.删除这个dataIndex，render: data => ,否则拿到的data是undefined
      //2. 下面这种，保留dataIndex:'action', render要写成 render: (_, data) =>， _是占位符
      title: '操作',
      render: data => { //data就是fetchArticleList时返回并存在ArticleData.list里的每一条被遍历的数据
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            {/* or: onClick={() => history.push(`/publish?id=${data.id}`)} */}
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  //用于看效果的静态数据
  // const data = [
  //   {
  //     id: '8218',
  //     comment_count: 0,
  //     cover: {
  //       images: ['http://geek.itheima.net/resources/images/15.jpg'],
  //     },
  //     like_count: 0,
  //     pubdate: '2019-03-11 09:00:00',
  //     read_count: 2,
  //     status: 2,
  //     title: 'wkwebview离线化加载h5资源解决方案'
  //   }
  // ]

  //频道列表管理,已移到Channelstore
  // const [channelList, setChannelList] = useState([])

  // useEffect(() => {
  //   //定义一个从后端取channel的函数
  //   const loadChannelList = async () => {
  //     const res = await http.get('/channels')
  //     //console.log(res) //看channels接口里有什么内容
  //     setChannelList(res.data.channels)
  //   }
  //   loadChannelList()
  // }, [])



  //从channelStore去频道列表,可直接去return里渲染列表(记得先去layout里导入并与useEffect绑定)
  const { channelStore } = useStore()

  //文章列表管理，统一管理数据
  const [articleData, setAticleData] = useState({
    list: [],
    count: 0
  })

  //文章页面参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  //获取后端article数据
  //只要涉及到异步请求的函数，都放到useEffect内部，
  //原因：函数写到外面每次组件更新都会重新进行函数初始化，这本身是一次性能消耗
  //而写到useEffect内部，只会在依赖项发生变化的时候，函数才会重新初始化，避免性能损失。
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      console.log(res) //查看res的结构，提取需要的数据
      const { results, total_count } = res.data
      setAticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])

  //在按了筛选键表格提交后，onFinish调用onSearch能拿到所有用户提交的要筛选的values
  //打印出来，挑选出需要的数据后setParams，再把Params发送服务器重新请求数据并渲染筛选后的列表
  const onSearch = (values) => { //这里的values是Form收集到的所有数据
    console.log(values) //先打印看看Form收集到的数据结构
    const { status, channel_id, date } = values
    const _params = {} //临时声明一个变量用来存要修改的参数 
    _params.status = status
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) { //通过之前的打印知道date的数据结构
      _params.begin_pubdate = date[0].format('YYYY-MM-DD') //返回的是个moment对象
      _params.end_pubdate = date[1].format('YYYY-MM-DD') //需要format格式化一下
    }
    // 修改params参数 触发接口再次发起请求
    setParams({
      ...params,
      ..._params
    })
  }

  //分页设置
  const onChangePage = (page) => {
    setParams({
      ...params,
      page: page
    })
  }
  //编辑跳转
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }



  //删除文章
  const delArticle = async (data) => {
    //console.log(data) //先打印看看能否收集到的文章id
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      page: 1,
      per_page: 10
    })
  }

  return (
    <div>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        {/* 对每个Form里面的数据采集只需要在Form标签里进行OnFinish，不需要每个item都进行OnFinish操作 */}
        {/* 下面的values值是根据接口来设置的，不能乱设，但是'全部'的时候是null，会报错，这里用-1代替 */}
        <Form
          onFinish={onSearch}
          initialValues={{ status: -1 }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(channels => <Option key={channels.id} value={channels.id}>{channels.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={{
            position: ['bottomRight'],
            current: params.page,
            pageSize: params.per_page,
            onChange: onChangePage,
            total: articleData.count //加上这个属性才能在条数超过10条时显示页码2
          }} />
      </Card>
    </div>
  )
}

export default Article