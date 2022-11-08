import React, { useEffect, useState } from 'react'
import zrequest from '../../../service'
import { Table, Button, Tag, message } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'

export default function AuditList() {
  // table数据
  const [tableData, setTableData] = useState([])
  const navagate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token'))
  const coloList = ['', 'orange', 'green', 'red']
  const wlist = ['', '审核中', '已通过', '未通过']
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
    }).then((res) => {
      setTableData(res.data)
      console.log(res.data)
    })
  }, [username])

  // table colums
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (item) => {
        return <Tag color={coloList[item]} >{wlist[item]}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => { handleRevert(item) }}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => { handPublish(item) }}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>
      }
    },
  ]


  // 撤销
  const handleRevert = (item) => {
    setTableData(tableData.filter(data => data.id !== item.id))
    zrequest.request({
      method: 'patch',
      url: `/news/${item.id}`,
      data: {
        auditState: 0
      }
    }).then(() => {
      message.success('撤销成功，您可以到草稿箱中查看您的新闻')
    })
  }
  // 更新
  const handleUpdate = (item) => {
    navagate(`/news-manage/update/${item.id}`)
  }
  // 发布
  const handPublish = (item) => {
    zrequest.request({
      method: 'patch',
      url: `/news/${item.id}`,
      data: {
        'publishState': 2,
        'publishTime': Date.now()
      }
    }).then(() => {
      navagate(`/publish-manage/published`)
      message.success('发布成功，您可以到【发布管理/已发布】中查看')
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
