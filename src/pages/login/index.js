import React from 'react'
import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
//import axios from 'axios'

const Login = () => {
  const { loginStore } = useStore() //从useStore里解构出loginStore
  const navigate = useNavigate()

  const onFinish = async (values) => { //value为Form里面填写获取的所有值
    //console.log(values)
    try {
      await loginStore.getToken({
        username: values.username, //或者写成：const {username, password} = values; 
        password: values.password      //loginStore.getToken({username, password})
      })
      //跳转首页
      navigate('/', { replace: true })
      //提示登录成功
      message.success('login success')
    } catch (e) {
      message.error(e.response.data || 'login fail') //先判断后端是否返回错误信息，有就 展示错误信息，没有就展示'登录失败',这里的message是antd的全局信息提示
    }
  }

  return (
    <div className='login'>
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          labelCol={{ span: 8 }}
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Mobile number"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input my number: 0426580613',
              },
              {
                pattern: /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
                message: 'Wrong mobile number',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" defaultValue="0426580613" placeholder='0426580613' />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input this password: 246810',
              },
              {
                len: 6,
                message: 'Password is 6 digits',
                validateTrigger: 'onBlur'
              }
            ]}>
            <Input size="large" defaultValue="246810" placeholder='246810' />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 8 }}
            name="remember"
            valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              Agree to our Privacy Policy
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login