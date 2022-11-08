import React from 'react'
import NewsPublish from '../../../components/publish-manager/NewsPublish.js'
import usePublish from '../../../components/publish-manager/usePublish.js'
import { Button } from 'antd'


// 待发布
export default function Released() {
  const { tabData, thePublish } = usePublish(1)
  const publish = (id) => {
    thePublish(id)
  }
  return (
    <div>
      <NewsPublish tabData={tabData}>
        {
          (id) => {
            return <Button type='primary' onClick={() => publish(id)}>发布</Button>
          }
        }
      </NewsPublish>
    </div>
  )
}
