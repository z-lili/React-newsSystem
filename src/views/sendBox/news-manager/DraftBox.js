import React, { useState, useEffect, useRef, useTransition } from 'react'
import { Table, Button, Modal, Switch, message } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import zrequest from '../../../service'
import { DeleteOutlined, EditOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'


export default function DraftBox() {
  // table数据
  const [tableData, setTableData] = useState([])
  const navagate = useNavigate()

  // 用户
  const users = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: `/news?author=${users.username}&auditState=0&_expand=category`
    }).then((res) => {
      setTableData(res.data)
      console.log(res.data)
    })
  }, [users])




  // table colums
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {/* 删除 */}
          <Button onClick={() => deleteNews(item)} disabled={item.default} danger shape='circle' icon={<DeleteOutlined />}></Button>
          <div style={{ display: ' inline-block', width: '10px' }}></div>
          {/* 修改 */}
          <Button onClick={() => { handleChange(item) }} disabled={item.default} type='primary' shape='circle' icon={<EditOutlined />}></Button>
          <div style={{ display: ' inline-block', width: '10px' }}></div>
          {/* 提交 */}
          <Button onClick={() => { showModal2(item.id) }} disabled={item.default} type='primary' shape='circle' icon={<UploadOutlined />}></Button>
        </div>
      }
    },
  ]


  // 删除新闻
  const { confirm } = Modal
  const deleteNews = (item) => {
    confirm({
      title: '您确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 页面同步，后端更新
        setTableData(tableData.filter((data) => data.id !== item.id))
        zrequest.request({
          method: 'delete',
          url: `news/${item.id}`
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 修改新闻
  const handleChange = (item) => {
    navagate(`/news-manage/update/${item.id}`)
  }

  // 提交审核
  const showModal2 = (id) => {
    zrequest.request({
      method: 'patch',
      url: `news/${id}`,
      data: {
        auditState: 1
      }
    }).then(() => {
      navagate('/audit-manage/list')
      message.success('提交成功，可到审核列表中查看')
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
