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
  //action动作发起请求，并有res返回，res里也有fileList属性，把该属性解构出来，提取url
  //声明fileList来存储和渲染上传图片成功后返回的url，赋值给<upload>里的fileList属性
  const [fileList, setFileList] = useState([])

  //声明一个暂存仓库来存取三图url
  const fileListRef = useRef([])

  const onUploadChange = ({ fileList }) => { //直接从res中解构fileList
    console.log(fileList)
    const formatList = fileList.map(file => {
      //上传完毕，提取数据
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
    //这样setFileList，fileList里每次只能存一个url, 存三图时前两个图的url会被第三个图的url覆盖，所以需要声明一个临时变量来暂存所有url
    fileListRef.current = formatList
  }


  //切换/显示封面图片框个数
  const [imaCount, setImaCount] = useState(1)
  const radioChange = (e) => {
    //console.log(e)
    setImaCount(e.target.value)

    if (e.target.value === 1) { //单图，只展示一张
      const firstImg = fileListRef.current ? fileListRef.current[0] : []
      setFileList([firstImg])//注意，数组格式
      //console.log(fileList)
    } else if (e.target.value === 3) { //三图，展示所有图片
      setFileList(fileListRef.current)
      //console.log(fileList)
    }
  }

  //提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => { //values包含了所有提交的数据，通过各个标签的name来关联获取。要先对数据提取和格式化，再发送后端
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
    message.success(`${articleId ? 'Update success' : 'Publish success'}`) //message是antd的全局提示组件

  }


  //根据路由id参数判断发布or编辑
  const [params] = useSearchParams()
  const articleId = params.get('id')

  //修改文章时数据回填，id调用接口，1.表单回填，2.暂存列表 3.upload组件fileList
  const form = useRef(null) //要控制Form DOM,需要用ref来绑定

  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`)
      const { cover, ...formValue } = res.data
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      const imageList = cover.images.map(url => ({ url }))
      setFileList(imageList)
      setImaCount(cover.type)
      fileListRef.current = imageList

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
                <Radio value={1}>Single picture</Radio>
                <Radio value={3}>Three pictures</Radio>
                <Radio value={0}>None</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 为保证Upload标签的缩进对齐，Upload要放在<Form.Item label='封面' >标签里 */}
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