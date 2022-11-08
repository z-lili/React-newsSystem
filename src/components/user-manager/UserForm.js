import React, { forwardRef } from 'react'
import { Form, Input, Select } from 'antd'


const UserForm = forwardRef((props, ref) => {
  const { Option } = Select
  return (
    <Form
      ref={ref}
      name="basic"
      layout="vertical"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 18,
      }}
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入用户名!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={[
          {
            required: true,
            message: '请输入区域!',
          },
        ]}
      >
        <Select
          style={{
            width: 120,
          }}
        // onChange={handleChange}
        >
          {
            props.regionData.map((item, index) => {
              return <Option value={item.value} key={item.id}>{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="角色"
        name="roleId"
        rules={[
          {
            required: true,
            message: '请输入角色!',
          },
        ]}
      >
        <Select
          style={{
            width: 120,
          }}
        // onChange={handleChange}
        >
          {
            props.roleData.map((item, index) => {
              return <Option value={item.id} key={item.id}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm