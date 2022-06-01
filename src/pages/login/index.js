import React from 'react'
import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { loginStore } = useStore() //从useStore里解构出loginStore
  const navigate = useNavigate()

  const onFinish = async (values) => { //value为Form里面填写获取的所有值
    //console.log(values)
    try {
      await loginStore.getToken({
        mobile: values.mobile, //或者写成：const {mobile, code} = values; 
        code: values.code      //loginStore.getToken({mobile, code})
      })
      //跳转首页
      navigate('/', { replace: true })
      //提示登录成功
      message.success('登录成功')
    } catch (e) {
      message.error(e.response?.data?.message || '登录失败') //先判断后端是否返回错误信息，有就展示错误信息，没有就展示'登录失败',这里的message是antd的全局信息提示
    }
  }

  return (
    <div className='login'>
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码!',
              },
              {
                len: 6,
                message: '验证码6个字符',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login