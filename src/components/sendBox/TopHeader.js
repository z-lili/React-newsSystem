import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { changeCollapse } from '../../store/modules/collapsedReducer.js'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { Layout, Dropdown, Menu, Avatar } from 'antd'
const { Header } = Layout

export default function TopHeader() {
  const navigate = useNavigate()

  const { role, username } = JSON.parse(localStorage.getItem('token'))

  const onclick = ({ key }) => {
    if (key == 2) {
      // 退出登录 清空localStorage 路由跳转
      // localStorage.removeItem('token')
      navigate('/login', {
        replace: true
      })
    }
  }

  const menu = (
    <Menu
      onClick={onclick}
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              {role.roleName}
            </a>
          ),
        },
        {
          key: '2',
          danger: true,
          label: '退出登录',
        },
      ]}
    />
  )
  // 点击折叠或者展开
  // 返回指定的state
  const { collapse } = useSelector((state) => state.collapsedSlice)
  const dispatch = useDispatch()
  const changeCollapsed = () => {
    dispatch(changeCollapse())
  }
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {
        collapse ? <MenuFoldOutlined onClick={changeCollapsed}></MenuFoldOutlined> : <MenuUnfoldOutlined onClick={changeCollapsed}></MenuUnfoldOutlined>
      }
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
        <div style={{ display: "inline-block", width: "10px" }}></div>
        <Dropdown overlay={menu}>
          <Avatar size='large' icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
