import React from 'react'
import NewsPublish from '../../../components/publish-manager/NewsPublish.js'
import usePublish from '../../../components/publish-manager/usePublish.js'
import { Button } from 'antd'

// 已发布
export default function ReadyPublish() {
  const { tabData, sunSet } = usePublish(2)
  const offline = (id) => {
    sunSet(id)
  }
  return (
    <div>
      <NewsPublish tabData={tabData}>
        {
          (id) => {
            return <Button onClick={() => offline(id)}>下线</Button>
          }
        }
      </NewsPublish>
    </div>
  )
}
