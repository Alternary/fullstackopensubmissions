import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: 'ALL',
  reducers: {
    filterChange(state, action) {
      return action.payload //state.filter = action.payload//this don't work
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
