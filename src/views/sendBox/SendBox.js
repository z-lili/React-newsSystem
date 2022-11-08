import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import SideMenu from '../../components/sendBox/SideMenu'
import TopHeader from '../../components/sendBox/TopHeader'


import './sendBox.css'
import { Layout } from 'antd'
const { Content } = Layout



// 主页
export default function SendBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  )
}
