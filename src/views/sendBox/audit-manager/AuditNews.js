import React, { useEffect, useState } from 'react'
import zrequest from '../../../service'
import { Table, Button, message } from 'antd'
import { NavLink } from 'react-router-dom'

export default function AuditNews() {
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const roleObj = {
      '1': 'superadmin',
      '2': 'admin',
      '3': 'editor',
    }
    zrequest.request({
      method: 'get',
      url: `/news?auditState=1&_expand=category`
    }).then((res) => {
      const list = res.data
      setTableData(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [roleId, region, username])

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
      render: (item) => {
        return <div>
          <Button type='primary' onClick={() => handleEdit(item, 2, 1)}>通过</Button>
          <div style={{ display: 'inline-block', width: '10px' }}></div>
          <Button danger onClick={() => handleEdit(item, 3, 0)}>驳回</Button>
        </div>
      }
    },
  ]

  const handleEdit = (item, auditState, publishState) => {
    setTableData(tableData.filter(data => data.id !== item.id))
    zrequest.request({
      method: 'patch',
      url: `/news/${item.id}`,
      data: {
        auditState,
        publishState
      }
    }).then(() => {
      message.success('已通过审核')
    })
  }

  return (
    <div>
      <Table rowKey={(item) => item.id} dataSource={tableData} columns={columns} pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
