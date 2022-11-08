// 这是根组件
import React from "react"
import { HashRouter } from 'react-router-dom' // 哈希模式路由

import YRouter from "./router/index"

function App() {
  return (
    <div>
      <HashRouter>
        <YRouter></YRouter>
      </HashRouter>
    </div>
  )
}

export default App
