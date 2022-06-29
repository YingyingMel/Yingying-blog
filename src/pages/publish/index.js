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



const Publish = () => {

  const { Option } = Select
  //导入频道列表
  const { channelStore } = useStore()


  //上传图片成功回调
  //fileList存放上传图片成功后返回的图片url，设置fileList初始值为空，当执行upload后，
  //action动作发起请求，并有res返回，res里也有fileList属性，把该属性解构出来，提取fileList赋值给url
  //声明fileList来存储和渲染上传图片成功后返回的地址名称，赋值给<upload>里的fileList属性
  const [fileList, setFileList] = useState([])

  const onUploadChange = ({ fileList }) => { //直接从res中解构fileList
    console.log(fileList)
    const formatList = fileList.map(file => {
      //上传完毕，提取数据
      if (file.response) {
        return {
          url: file.response.url //提取response里的url,其他信息不要，文档有截图
        }
      }
      //否则在上传中，不做处理
      return file
    })
    console.log(formatList)
    setFileList(formatList)
  }


  //切换/显示封面图片框个数
  const [imaCount, setImaCount] = useState(1)
  const radioChange = (e) => {
    //console.log(e)
    setImaCount(e.target.value)
  }


  //提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => { //values包含了所有提交的数据，通过各个标签的name来关联获取。要先对数据提取和格式化，再发送后端
    const { channel_id, content, title } = values
    const params = {
      channel_id: channel_id,
      content: content,
      title: title,
      images: JSON.stringify(fileList) //把fileList里的图片对象转成字符串发给服务器
    }
    //console.log(params)

    if (articleId) {
      //编辑修改
      await http.put(`/my/article/edit/${articleId}`, { ...params, id: articleId })
    } else {
      //新增发布
      await http.post('/my/article/add', params)
    }

    //修改/发布完成后跳转并提示
    navigate('/article')
    message.success(`${articleId ? 'Update success' : 'Publish success'}`) //message是antd的全局提示组件

  }


  //根据路由id参数判断发布or编辑
  const [params] = useSearchParams()
  const articleId = params.get('id')

  //修改文章时数据回填，id调用接口，1.表单回填，2.upload组件fileList
  const form = useRef(null) //要控制Form DOM,需要用ref来绑定

  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/my/article/${articleId}`)
      console.log(res)
      const { images, ...formValue } = res.data.data
      form.current.setFieldsValue({ ...formValue })//数据回填
      //把服务器发回的图片字符串转回对象格式，存到fileList
      setFileList(JSON.parse(images))
      console.log(JSON.parse(images))
    }
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
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? 'Update' : 'Publish'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          ref={form} //通过ref来把form和<Form/>绑定，通过操作form来操作控制<Form/>
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input a title' }]}
          >
            <Input placeholder="Please input a title" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="channel_id"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Please select a category" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Cover">
            {/* 单独用一个<Form.Item/>标签把下面的Radio.Group包起来,是为了让Radio与upload对齐和有上下间距 */}
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>upload cover</Radio>
                <Radio value={0}>No cover</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 为保证Upload标签的缩进对齐，Upload要放在<Form.Item label='封面' >标签里 */}
            {imaCount > 0 && (
              <Upload
                name="images"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="https://blog-yy-server.herokuapp.com/api/upload"
                fileList={fileList}
                onChange={onUploadChange} //上传后有服务器的信息返回
                // multiple={imaCount > 1}
                maxCount='1'
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            initialValue=''
            rules={[{ required: true, message: 'Please input your diary' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="Input your diary here"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? 'Update' : 'Publish'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)