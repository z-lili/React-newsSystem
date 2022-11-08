import { configureStore } from '@reduxjs/toolkit'
import collapsedSlice from './modules/collapsedReducer'


// 创建store 导出
export const store = configureStore({
  reducer: {
    collapsedSlice
  }
})