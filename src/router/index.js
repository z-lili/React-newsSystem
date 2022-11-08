import React from 'react'
import { useRoutes, Navigate } from "react-router-dom"
import SendBox from '../views/sendBox/SendBox'
import Login from '../views/login/Login'
import { useUtiles } from './useUtiles'




// 路由懒加载
const lazyLoad = (path) => {
  const Comp = React.lazy(() => import(`../views/sendBox/${path}`))
  return (
    <React.Suspense fallback={<>加载中...</>}>
      <Comp></Comp>
    </React.Suspense>
  )
}

// 路由导航守卫
function AuthComponent(props) {
  const isLoign = true
  return isLoign ? props.children : <Navigate to={'/login'}></Navigate>
}




export default function YRouter() {
  const element = useRoutes([
    {
      path: '/',
      element: <Navigate to={'/home'}></Navigate>
    },
    {
      path: '/login',
      element: <Login></Login>
    },
    {
      path: '/',
      element: <SendBox></SendBox>,
      children: [
        {
          path: '',
          element: lazyLoad('home/Home')
        },
        // 动态路由
        ...useUtiles(),
        {
          path: '*',
          element: lazyLoad('notFound/NotFound')
        }
      ]
    },
  ])

  return (
    element
  )
}