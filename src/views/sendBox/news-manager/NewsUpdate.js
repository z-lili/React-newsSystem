import React, { useEffect, useState, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message } from 'antd'
import { useParams } from 'react-router-dom'
import style from './newsManager.module.css'
import zrequest from '../../../service'
import MyEditor from '../../../components/news-manager/MyEditor'

export default function NewsUpdate() {
  const [stepCurrent, setStepCurrent] = useState(0)
  const [category, setCategory] = useState([])
  const [editorContain, setEditorContain] = useState(null) // 富文本内容
  const [formContain, setFormContain] = useState({})
  const users = JSON.parse(localStorage.getItem('token'))
  const { Step } = Steps
  const formRef = useRef(null)
  const { id } = useParams()  //获取路由中的参数
  const [newContain, setNewContain] = useState('')

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/categories'
    }).then((res) => {
      setCategory(res.data)
    })
  }, [])

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: `/news/${id}?_expand=category&_expand=role`
    }).then((res) => {
      setNewContain(res.data.content)
      let { title, categoryId } = res.data
      formRef.current.setFieldsValue({
        title,
        category: categoryId
      })
    })
  }, [id])

  // 下一步
  const next = () => {
    formRef.current.validateFields().then((res) => {
      setStepCurrent(stepCurrent + 1)
      let res2 = JSON.parse(JSON.stringify(res).replace(/category/, 'categoryId'))
      setFormContain(res2)
    }).catch((err) => {
      console.log(err)
    })
  }

  // 存到草稿箱
  const saveDraft = (auditState) => {
    zrequest.request({
      method: 'patch',
      url: `/news/${id}`,
      data: {
        ...formContain,
        "content": editorContain,
        "auditState": auditState,
      }
    }).then(() => {
      message.success('成功保存到草稿箱~')
    })
  }


  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="更新新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={stepCurrent}>
        <Step title="基本信息" description="新闻标题，新闻分类。" />
        <Step title="新闻内容" description="新闻主体内容。" />
        <Step title="新闻提交" description="保存草稿或提交审核。" />
      </Steps>

      <div style={{ marginTop: '50px' }}>
        <div className={stepCurrent === 0 ? '' : style.active}>
          <Form
            name="basic"
            ref={formRef}
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}
            initialValues={{
              remember: true,
            }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: '请输入标题!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="category"
              rules={[
                {
                  required: true,
                  message: '请选择分类!',
                },
              ]}
            >
              <Select>
                {
                  category.map((item) => {
                    return <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        {/* 富文本 */}
        <div className={stepCurrent === 1 ? '' : style.active}>
          <MyEditor content={newContain} getContent={(val) => {
            setEditorContain(val)
          }}></MyEditor>
        </div>
        <div className={stepCurrent === 2 ? '' : style.active}>333</div>
      </div>
      <div style={{ marginTop: '50px' }}>
        {
          stepCurrent !== 2 && <Button type='primary' onClick={next}>下一步</Button>
        }
        {
          stepCurrent == 2 && <span>
            <Button type='primary'>提交审核</Button>
            <Button danger onClick={() => { saveDraft(0) }}>保存草稿箱</Button>
          </span>
        }
        {
          stepCurrent !== 0 && <Button onClick={() => {
            setStepCurrent(stepCurrent - 1)
          }}>上一步</Button>
        }
      </div>
    </div>
  )
}
