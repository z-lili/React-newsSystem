import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './index.css'
import zlrequest from '../../service/index'


import { Layout, Menu } from 'antd'
const { Sider } = Layout


export default function SideMenu() {

  const navigate = useNavigate() // 编程式导航
  const location = useLocation() // 接收跳转传过来的值(path,state)
  const { role } = JSON.parse(localStorage.getItem('token')) // 用户登录后 得到的用户具有的权限
  const [menuData, setMenuData] = useState([])
  function getItem(label, key, children) {
    return {
      key,
      children,
      label,
    }
  }
  // 根据后端数据递归动态渲染menu
  function renderMenu(list) {
    let arr = []
    list.map((item) => {
      if (item.children && item.children.length !== 0 && role.rights.includes(item.key)) {
        return arr.push(getItem(item.title, item.key, renderMenu(item.children)))
      } else {
        if (role.rights.includes(item.key) && item.pagepermission) {
          return arr.push(getItem(item.title, item.key))
        }
      }
    })
    return arr
  }
  // 请求数据(权限列表)
  useEffect(() => {
    zlrequest.request({
      method: 'get',
      url: '/rights?_embed=children'
    }).then((res) => {
      // console.log(res.data)
      setMenuData(res.data)
    })
  }, [])



  // 点击menu每一项
  const handlClick = (e) => {
    console.log(e)
    navigate(e.key) // 页面跳转
  }

  // 展开的menu项
  const openkeys = '/' + location.pathname.split('/')[1]

  const { collapse } = useSelector((state) => state.collapsedSlice)

  return (
    <Sider trigger={null} collapsed={collapse} collapsible>
      <div className='logo'>全球新闻发布管理系统</div>
      <Menu
        theme='dark'
        style={{
          width: '100%',
        }}
        defaultOpenKeys={[openkeys]}
        defaultSelectedKeys={[location.pathname]}
        onClick={handlClick}
        mode="inline"
        items={renderMenu(menuData)}
      />
    </Sider>
  )
}
