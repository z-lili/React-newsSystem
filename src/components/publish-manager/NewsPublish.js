import React from 'react'
import { Table } from 'antd'
import { NavLink } from 'react-router-dom'
// 封装的复用组件
export default function NewsPublish(props) {

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (item) => {
        return item.title
      }
    },
    {
      title: '操作',
      render: (item, item2) => {
        return <div>
          {/* 插槽，不同类型button */}
          {props.children && props.children(item2.id)}
        </div>
      }
    },
  ]

  return (
    <div>
      <Table rowKey={(item) => item.id} dataSource={props.tabData} columns={columns} pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
