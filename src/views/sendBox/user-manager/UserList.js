import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import zrequest from '../../../service'
import UserForm from '../../../components/user-manager/UserForm'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'


export default function RoleList() {
  // table数据
  const [tableData, setTableData] = useState([])
  // 区域
  const [regionData, setRegionData] = useState([])
  // 角色
  const [roleData, setRoleData] = useState([])
  // 
  const [current, setCurrent] = useState([])
  const formRef = useRef(null)
  const updateRormRef = useRef(null)


  // table 用户
  const { roleId } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/users?_expand=role'
    }).then((res) => {
      const list = res.data
      setTableData(list.filter(item => item.roleId
        > roleId))
    })
  }, [])
  // 区域
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/regions'
    }).then((res) => {
      setRegionData(res.data)
      console.log(res.data)
    })
  }, [])
  // 角色数据
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/roles'
    }).then((res) => {
      setRoleData(res.data)
      console.log(res.data)
    })
  }, [])




  // table colums
  const columns = [
    {
      title: '区域',
      filters: [
        ...regionData.map((item) => {
          return {
            text: item.title,
            value: item.value
          }
        }),

      ],
      dataIndex: 'region',
      onFilter: (value, item) => item.region === value,
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch onChange={() => handleChange(item)} checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {/* 删除 */}
          <Button onClick={() => deleteRole(item)} disabled={item.default} danger shape='circle' icon={<DeleteOutlined />}></Button>
          <div style={{ display: ' inline-block', width: '10px' }}></div>
          {/* 更改 */}
          <Button onClick={() => { showModal2(item) }} disabled={item.default} type='primary' shape='circle' icon={<EditOutlined />}></Button>

        </div>
      }
    },
  ]

  // 点击添加用户
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  // 确认添加
  const handleOk = () => {
    setIsModalOpen(false)
    formRef.current.resetFields()
    // 通过ref传递获取到子组件的form ref 调用预校验方法
    formRef.current.validateFields().then((value) => {
      // 校验通过 后端新增数据 前端数据改变
      zrequest.request({
        method: 'post',
        url: '/users',
        data: {
          ...value,
          "roleState": true,
          "default": false
        }
      }).then
        ((res) => {
          setTableData([...tableData, {
            ...res.data,
            role: roleData.filter((item) => item.id === value.roleId)[0]
          }])
        })
    }).catch((err) => {
      console.log(err)
    })
  }
  // 取消添加
  const handleCancel = () => {
    setIsModalOpen(false)
    formRef.current.resetFields()
  }

  // 删除用户
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
          url: `users/${item.id}`
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 修改状态
  const handleChange = (item) => {
    item.roleState = !item.roleState
    setTableData([...tableData])
    zrequest.request({
      method: 'patch',
      url: `/users/${item.id}`,
      data: {
        roleState: item.roleState
      }
    })
  }

  // 编辑用户
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  // 展示对话框
  const showModal2 = (item) => {
    setCurrent(item)
    setIsModalOpen2(true)
    setTimeout(() => {
      updateRormRef.current.setFieldsValue(item)
    }, 0)
    console.log(item)
  }
  // 确定修改
  const sureChange = () => {
    updateRormRef.current.validateFields().then((value) => {
      setIsModalOpen2(false)
      setTableData(tableData.map((item) => {
        if (item.id == current.id) {
          return {
            ...item,
            ...value,
            role: roleData.filter(data => data.id === value.roleId[0])
          }
        }
        return item
      }))
      zrequest.request({
        method: 'patch',
        url: `/users/${current.id}`,
        data: {
          ...value
        }
      })
    })
  }
  const cancelChange = () => {
    setIsModalOpen2(false)
  }

  return (
    <div>
      <div style={{ margin: '5px' }}>
        <Button onClick={() => { showModal() }} type='primary'>添加用户</Button>
      </div>
      <Table rowKey={(item) => item.id} dataSource={tableData} columns={columns} pagination={{
        pageSize: 5
      }} />
      {/* 对话框 */}
      <Modal title="添加用户" okText="确定" cancelText="取消" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <UserForm ref={formRef} regionData={regionData} roleData={roleData}></UserForm>
      </Modal>


      {/* 编辑用户的对话框 */}
      <Modal title="编辑用户信息" okText="确定" cancelText="取消" open={isModalOpen2} onOk={sureChange} onCancel={cancelChange}>
        <UserForm ref={updateRormRef} regionData={regionData} roleData={roleData}></UserForm>
      </Modal>
    </div>
  )
}
