import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'

const { Option } = Select

const Publish = () => {
  //导入频道列表
  const { channelStore } = useStore()

  //图片个数根据按钮适配
  //声明一个暂存仓库
  const fileListRef = useRef([])



  //上传图片成功回调
  //fileList存放上传图片成功后返回的图片url，设置fileList初始值为空，当执行upload后，
  //action动作发起请求，并有res返回，res里也有fileList属性，把该属性解构出来，提取url
  const [fileList, setFileList] = useState([])
  const onUploadChange = ({ fileList }) => { //直接从res中解构fileList
    console.log(fileList)
    const formatList = fileList.map(file => {
      //上传完毕，做数据处理
      if (file.response) {
        return {
          url: file.response.data.url //提取response里的url,其他信息不要
        }
      }
      //否则在上传中，不做处理
      return file
    })
    //查看上传图片后服务器返回的信息
    //会打印3次，percent: 0，event: ProgressEvent，percent: 100
    //最后一次打印的res里才有file.response.data.url
    setFileList(formatList)
    //上传图片时，将所有图片url暂时存储到 fileListRef 中
    fileListRef.current = formatList
  }


  //切换/显示封面图片框个数
  const [imaCount, setImaCount] = useState(1)
  const radioChange = (e) => {
    //console.log(e)
    setImaCount(e.target.value)

    if (e.target.value === 1) { //单图，只展示一张
      const firstImg = fileListRef.current ? fileListRef.current[0] : []
      setFileList([firstImg])
    } else if (e.target.value === 3) { //三图，展示所有图片
      setFileList(fileListRef.current)
    }
  }

  //提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => {
    console.log(values)
    //根据文档从打印出的values里取值，并对cover字段进行二次处理
    const { channel_id, content, title, type } = values
    const params = {
      channel_id: channel_id,
      content: content,
      type: type,
      title: title,
      cover: {
        type: type,
        images: [fileList.map(item => item.url)]
      }
    }

    if (articleId) {
      //编辑修改
      await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      //新增发布
      await http.post('/mp/articles?draft=false', params)
    }

    //修改/发布完成后跳转并提示
    navigate('/article')
    message.success(`${articleId ? '修改成功' : '发布成功'}`)

  }


  //根据路由id参数判断发布or编辑
  const [params] = useSearchParams()
  const articleId = params.get('id')

  //修改文章时数据回填，id调用接口，1.表单回填，2.暂存列表 3.upload组件fileList
  const form = useRef(null) //要控制Form DOM,需要用ref来绑定
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`)
      //console.log(res.data)打印查看请求是否发送，返回值的格式是什么
      //从res.data拿到数据填回表单，用antD内置方法setFieldsValue回填
      const { cover, ...formValue } = res.data
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      //格式化封面图片数据
      const imageList = cover.images.map(url => ({ url }))
      //调用setFileList方法回填upload
      setFileList(imageList)
      setImaCount(cover.type)
      fileListRef.current = imageList //暂存列表也要更新，要不单图、三图按钮不起作用

    }
    //必须是编辑修改状态，才可以发送请求
    if (articleId) {
      loadDetail()
    }
  }, [articleId])



  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '修改文章' : '发布文章'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imaCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange} //上传后有服务器的信息返回
                multiple={imaCount > 1}
                maxCount={imaCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            initialValue=''
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '修改文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)