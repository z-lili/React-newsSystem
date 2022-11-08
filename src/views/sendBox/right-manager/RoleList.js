import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import zrequest from '../../../service'
import { DeleteOutlined, PicCenterOutlined, ExclamationCircleOutlined } from '@ant-design/icons'


export default function RoleList() {
  // table数据
  const [tableData, setTableData] = useState([])
  const [roleId, setRoleId] = useState(0)

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/roles'
    }).then((res) => {
      setTableData(res.data)
      console.log(res.data)
    })
  }, [])

  // 权限数据（用来渲染出初始树型控件）
  const [rolesData, setRolesData] = useState([])
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/rights?_embed=children'
    }).then((res) => {
      setRolesData(res.data)
      console.log(res.data)
    })
  }, [])

  // 删除角色
  const { confirm } = Modal
  const deleteRole = (item) => {
    confirm({
      title: '您确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // 页面同步，后端更新
        setTableData(tableData.filter((data) => data.id !== item.id))
        zrequest.request({
          method: 'delete',
          url: `roles/${item.id}`
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  // 当前点击的某一角色，获取他具有的权限（来自用户数据）
  const [currentRights, changeCurrentRights] = useState([])


  // 处理对话框
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 打开对话框 当前点击的某一角色，获取他具有的权限（来自用户数据）
  const showModal = (item) => {
    setIsModalOpen(true)
    changeCurrentRights(item.rights)
    setRoleId(item.id) // 角色id
  }
  // 点击勾选或取消勾选 返回的是剩余的权限
  const onCheck = (checkKeys) => {
    changeCurrentRights(checkKeys.checked) //赋值给当前应该勾选的权限
  }
  // 点击确定修改
  const handleOk = () => {
    console.log(rolesData)
    setIsModalOpen(false)
    // 同步前端数据（修改角色数据中的权限）
    setTableData(tableData.map((item) => {
      if (item.id == roleId) {
        return {
          ...item,
          rights: currentRights // 替换
        }
      } else {
        return item
      }
    }))
    // 发起后端修改
    zrequest.request({
      method: 'patch',
      url: `/roles/${roleId}`,
      data: {
        rights: currentRights
      }
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {/* 删除 */}
          <Button onClick={() => deleteRole(item)} danger shape='circle' icon={<DeleteOutlined />}></Button>
          <div style={{ display: ' inline-block', width: '10px' }}></div>
          {/* 分配权限 */}
          <Button onClick={() => { showModal(item) }} type='primary' shape='circle' icon={<PicCenterOutlined />}></Button>

        </div>
      }
    },
  ]

  return (
    <div>
      <Table rowKey={(item) => item.id} dataSource={tableData} columns={columns} pagination={{
        pageSize: 5
      }} />
      {/* 对话框 */}
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rolesData}
        />
      </Modal>
    </div>
  )
}
