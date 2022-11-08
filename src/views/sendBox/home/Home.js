import React, { useEffect, useState } from 'react'
import { Card, Col, List, Row, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import zrequest from '../../../service/index'

export default function Home() {
  const { Meta } = Card;
  const [viewData, setViewData] = useState()
  const users = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: '/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6'
    }).then((res) => {
      setViewData(res.data)
      console.log(res.data)
    })
  }, [])
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              bordered={false}
              dataSource={viewData}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              bordered={false}
              dataSource={viewData}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={users.username}
              description={users.region}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
