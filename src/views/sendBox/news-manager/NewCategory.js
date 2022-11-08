import React, { useEffect, useState, useContext, useRef } from 'react'
import zrequest from '../../../service'
import { Table, Button, Input, Form, Modal } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function NewCategory() {
  // table数据
  const [tableData, setTableData] = useState([])
  const navagate = useNavigate()
  const { username } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/categories'
    }).then((res) => {
      setTableData(res.data)
    })
  }, [])

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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button onClick={() => {
            deleteCategory(item)
          }} danger shape='circle' icon={<DeleteOutlined />}></Button>
        </div>
      }
    },
  ]

  // 保存修改后的单元格数据
  const handleSave = (record) => {
    setTableData(tableData.map((data) => {
      if (data.id === record.id) {
        return {
          id: data.id,
          title: record.title,
          value: record.title
        }
      } else {
        return data
      }
    }))

    zrequest.request({
      method: 'patch',
      url: `/categories/${record.id}`,
      data: {
        title: record.title,
        value: record.title
      }
    })
  }




  // 删除
  const { confirm } = Modal
  const deleteCategory = (item) => {
    confirm({
      title: '您确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setTableData(tableData.filter(data => data.id !== item.id))
        zrequest.request({
          method: 'get',
          url: `/categories/${item.id}`
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  // 可编辑单元格设置
  const EditableContext = React.createContext(null)

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
      <Table components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }} rowKey={(item) => item.id} dataSource={tableData} columns={columns} pagination={{
        pageSize: 5
      }} />
    </div>
  )
}
