import React from 'react'
import NewsPublish from '../../../components/publish-manager/NewsPublish.js'
import usePublish from '../../../components/publish-manager/usePublish.js'
import { Button } from 'antd'

// 已下线
export default function ReadyPublish() {
  const { tabData, theDelete } = usePublish(3)
  const remove = (id) => {
    theDelete(id)
  }
  return (
    <div>
      <NewsPublish tabData={tabData}>
        {
          (id) => {
            return <Button danger onClick={() => remove(id)}>删除</Button>
          }
        }
      </NewsPublish>
    </div>
  )
}
