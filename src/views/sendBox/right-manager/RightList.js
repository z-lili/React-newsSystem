import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import zrequest from '../../../service'


export default function RightList() {

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/rights?_embed=children'
    }).then((res) => {
      setTableData(res.data)
      console.log(res.data)
    })
  }, [])

  const [tableData, setTableData] = useState([])
  // swich切换事件
  const onChange = (item) => {
    item.pagepermission = item.pagepermission == 1 ? 0 : 1
    setTableData([...tableData])
    if (item.grade == 1) {
      zrequest.request({
        method: 'patch',
        url: `/rights/${item.id}`,
        data: {
          pagepermission: item.pagepermission
        }
      })
    } else {
      zrequest.request({
        method: 'patch',
        url: `/children/${item.id}`,
        data: {
          pagepermission: item.pagepermission
        }
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {/* 删除 */}
          <Button onClick={() => deleteRight(item)} danger shape='circle' icon={<DeleteOutlined />}></Button>
          <div style={{ display: ' inline-block', width: '10px' }}></div>
          {/* 操作 */}
          <Popover content={<div style={{ textAlign: 'center' }}>
            <Switch checked={item.pagepermission} onChange={() => onChange(item)} />
          </div>} title="配置项" trigger={item.pagepermission === undefined ? '' : 'click'}>
            <Button disabled={item.pagepermission === undefined} type='primary' shape='circle' icon={<EditOutlined />}></Button>
          </Popover>

        </div>
      }
    },
  ]


  // 删除权限（包括一级和二级）
  const { confirm } = Modal
  const deleteRight = (item) => {
    confirm({
      title: '您确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 页面同步，后端更新
        if (item.grade == 1) {
          setTableData(tableData.filter((data) => data.id !== item.id))
          zrequest.request({
            method: 'delete',
            url: `rights/${item.id}`
          })
        } else {
          let list = tableData.filter(data => data.id === item.rightId)
          list[0].children = list[0].children.filter(data => data.id !== item.id)
          setTableData([...tableData])
          zrequest.request({
            method: 'delete',
            url: `children/${item.id}`
          })
        }

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  return (
    <div>
      <Table dataSource={tableData} columns={columns} pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
