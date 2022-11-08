import { useState, useEffect } from 'react'
import { message } from 'antd'
import zrequest from "../../service"


// 自定义hook
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [tabData, setTabData] = useState([])
  useEffect(() => {
    zrequest.request({
      method: 'get',
      url: `/news?author=${username}&publishState=${type}&_expand=category`
    }).then((res) => {
      setTabData(res.data)
    })
  }, [username])

  // 发布
  const thePublish = (id) => {
    setTabData(tabData.filter(item => item.id !== id))
    zrequest.request({
      method: 'patch',
      url: `/news/${id}`,
      data: {
        'publishState': 2,
        'publishTime': Date.now()
      }
    }).then(() => {
      message.success('发布成功，您可以到【发布管理/已发布】中查看')
    })
  }
  // 下线
  const sunSet = (id) => {
    setTabData(tabData.filter(item => item.id !== id))
    zrequest.request({
      method: 'patch',
      url: `/news/${id}`,
      data: {
        'publishState': 3,
      }
    }).then(() => {
      message.success('下线成功，您可以到【发布管理/已下线】中查看')
    })
  }
  // 删除
  const theDelete = (id) => {
    setTabData(tabData.filter(item => item.id !== id))
    zrequest.request({
      method: 'delete',
      url: `/news/${id}`,
    }).then(() => {
      message.success('删除成功')
    })
  }
  return {
    tabData,
    thePublish,
    sunSet,
    theDelete
  }
}
export default usePublish