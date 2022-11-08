import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { Button, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import zrequest from '../../service'
import './login.css'

export default function Login() {
  const navigate = useNavigate()
  // 登录
  const onFinish = (values) => {
    zrequest.request({
      method: 'get',
      url: `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
    }).then((res) => {
      if (res.data.length === 0) {
        message.error('用户名或者密码不匹配')
      } else {
        // 存储用户信息到localStorage
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        navigate('/home', {
          replace: true
        })
      }
    })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (

    <div style={{ background: 'rgb(35,39,65)', height: '100%', position: 'relative' }}>

      <div className='formContain'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
          style={{ width: '100%' }}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 38,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item

            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0d47a1",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  )
}
