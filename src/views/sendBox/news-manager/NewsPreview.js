import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import zrequest from '../../../service'
import { Button, Descriptions, PageHeader } from 'antd'
import moment from 'moment'


export default function NewsPreview() {
  const { id } = useParams()  //获取路由中的参数
  const [dataSorce, setDataSorce] = useState({})

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']

  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: `/news/${id}?_expand=category&_expand=role`
    }).then((res) => {
      setDataSorce(res.data)
      console.log(res.data)
    })
  }, [id])
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={dataSorce.title}
        subTitle="This is a subtitle"
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{dataSorce.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(dataSorce.createTime).format('YYY/MM/DD HH:MM:SS')}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{dataSorce.publishTime ? moment(dataSorce.publishTime).format('YYY/MM/DD HH:MM:SS') : '-'}</Descriptions.Item>
        </Descriptions>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="区域">{dataSorce.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态"><span style={{ color: 'red' }}>{auditList[dataSorce.auditState]}</span></Descriptions.Item>
          <Descriptions.Item label="发布状态"><span style={{ color: 'red' }}>{publishList[dataSorce.publishState]}</span></Descriptions.Item>
        </Descriptions>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="访问数量">{dataSorce.views}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{dataSorce.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量">0</Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <div dangerouslySetInnerHTML={{
        __html: dataSorce.content
      }}>
      </div>
    </div>
  )
}
