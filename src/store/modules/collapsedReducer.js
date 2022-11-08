import { createSlice } from '@reduxjs/toolkit'

export const collapsedSlice = createSlice({
  name: 'collapsedSlice',
  initialState: {
    collapse: false,
    isShowSpinning: false
  },

  reducers: {
    changeCollapse(state, action) {
      state.collapse = !state.collapse
    },
    changeShowSpinniong(state, action) {
      state.isShowSpinning = !state.isShowSpinning
    }
  }
})

// 导出action函数
export const { changeCollapse, changeShowSpinniong } = collapsedSlice.actions

export default collapsedSlice.reducer