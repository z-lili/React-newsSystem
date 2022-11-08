import React, { useEffect, useState } from 'react'
import zrequest from '../service'

// 自定义钩子函数
export const useUtiles = () => {

  let { role } = JSON.parse(localStorage.getItem('token')) // 个人具备的权限

  // const [allRights, setAllRights] = useState([]) // 所有权限
  // useEffect(() => {
  //   Promise.all([
  //     zrequest.request({
  //       method: 'get',
  //       url: '/rights'
  //     }),
  //     zrequest.request({
  //       method: 'get',
  //       url: '/children'
  //     })
  //   ]).then((res) => {
  //     setAllRights([...res[0].data, ...res[1].data])
  //   })
  // }, [])

  // 路由懒加载
  const lazyLoad = (path) => {
    const Comp = React.lazy(() => import(`../views/sendBox/${path}`))
    return (
      <React.Suspense fallback={<>加载中...</>}>
        <Comp></Comp>
      </React.Suspense>
    )
  }

  let routRelation = [
    {
      path: 'home',
      element: lazyLoad('home/Home')
    },
    {
      path: 'user-manage/list',
      element: lazyLoad('user-manager/UserList')
    },
    {
      path: 'right-manage/role/list',
      element: lazyLoad('right-manager/RoleList')
    },
    {
      path: 'right-manage/right/list',
      element: lazyLoad('right-manager/RightList')
    },
    {
      path: 'news-manage/add',
      element: lazyLoad('news-manager/WriteNews')
    },
    {
      path: 'news-manage/draft',
      element: lazyLoad('news-manager/DraftBox')
    },
    {
      path: 'news-manage/category',
      element: lazyLoad('news-manager/NewCategory')
    },
    {
      path: 'audit-manage/audit',
      element: lazyLoad('audit-manager/AuditNews')
    },
    {
      path: 'audit-manage/list',
      element: lazyLoad('audit-manager/AuditList')
    },
    {
      path: 'publish-manage/unpublished',
      element: lazyLoad('publish-manager/Released')
    },
    {
      path: 'publish-manage/published',
      element: lazyLoad('publish-manager/ReadyPublish')
    },
    {
      path: 'publish-manage/sunset',
      element: lazyLoad('publish-manager/Offline')
    },
    {
      path: 'news-manage/preview/:id',
      element: lazyLoad('news-manager/NewsPreview')
    },
    {
      path: 'news-manage/update/:id',
      element: lazyLoad('news-manager/NewsUpdate')
    }
  ]

  let arr = []
  routRelation.map((item) => {
    if (role.rights.includes('/' + item.path)) {
      return arr.push(item)
    }
  })
  return arr
}

