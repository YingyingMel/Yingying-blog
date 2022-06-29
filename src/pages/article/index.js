import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import 'moment' //无需安装，直接引入
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import './index.scss'
import { http } from '@/utils'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {

  //表格columns结构,是根据后端的文档数据设置的，里面的参数是单个文章里面的属性,dataIndex要与后端数据的字段名相同
  const columns = [
    {
      title: 'Cover',
      dataIndex: 'images',
      render: images => { //下面src地址要根据后端返回数据提取url，文档里有res截图
        //console.log(JSON.parse(images))
        return <img src={JSON.parse(images)[0] ? JSON.parse(images)[0].url : img404} width={80} height={60} alt="" />
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 220
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => {
        switch (status) {
          case 2: return <Tag color="grey">Draft</Tag>
          case 3: return <Tag color="blue">Reviewing</Tag>
          case 4: return <Tag color="green">Reviewed</Tag>
          case 5: return <Tag color="red">Review failed</Tag>
          default: return <Tag color="blue">Reviewing</Tag>
        }
      }
    },
    {
      title: 'pub_date',
      dataIndex: 'pub_date'
    },
    {
      title: 'Readings',
      dataIndex: 'read_count'
    },
    {
      title: 'Comments',
      dataIndex: 'comment_count'
    },
    {
      title: 'Likes',
      dataIndex: 'like_count'
    },
    {//对于action,有两种方案，1.下面这种，删除这个dataIndex(dataIndex用于与后端数据库字段匹配)，render: data => ,否则拿到的data是undefined
      //2. 保留dataIndex:'action', render要写成 render: (_, data) =>， _是占位符
      title: 'Action',
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
              title="Are you sure to delete it?"
              onConfirm={() => delArticle(data)}
              okText="yes"
              cancelText="cancel"
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
      const res = await http.get('/my/article/list', { params })
      //console.log(res)
      setAticleData({
        list: res.data.data,
        count: res.data.total_count
      })
    }
    loadList()
  }, [params])

  //在按了筛选键表格提交后，onFinish调用onSearch能拿到所有用户提交的要筛选的values
  //打印出来，挑选出需要的数据后setParams，再把Params发送服务器重新请求数据并渲染筛选后的列表
  const onSearch = (values) => { //这里的values是Form收集到的所有数据
    //console.log(values)
    const { status, channel_id, date } = values
    const _params = {} //临时声明一个变量用来存要修改的参数 
    if (status === 1) {
      _params.status = null
    } else {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('DD-MM-YYYY') //返回的是个moment对象
      _params.end_pubdate = date[1].format('DD-MM-YYYY') //需要format格式化一下
    }
    //console.log(_params)
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
    await http.delete(`/my/article/delete/${data.id}`)
    // 更新列表
    setParams({
      page: 1,
      per_page: 10
    })
  }

  return (
    <div className='site-card-border-less-wrapper'>
      {/* 筛选区域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Diary List</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        {/* 对每个Form里面的数据采集只需要在Form标签里进行OnFinish，不需要每个item都进行OnFinish操作 */}
        {/* 下面的values值是根据接口来设置的，不能乱设，但是'all'的时候是null，会报错，这里用-1代替 */}
        <Form
          onFinish={onSearch}
          initialValues={{ status: 1 }}
          labelCol={{ span: 2 }}>
          <Form.Item label="Status" name="status">
            <Radio.Group>
              <Radio value={1}>All</Radio>
              <Radio value={2}>Draft</Radio>
              <Radio value={3}>Reviewing</Radio>
              <Radio value={4}>Reviewed</Radio>
              <Radio value={5}>Review failed</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Category" name="channel_id">
            <Select
              placeholder="category select"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(channels => <Option key={channels.id} value={channels.id}>{channels.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <RangePicker></RangePicker>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 2 }}>
            <Button type="primary" htmlType="submit" >
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区域 */}
      <Card title={` Results found: ${articleData.count} `}>
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