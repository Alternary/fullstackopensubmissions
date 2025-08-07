import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'No notification',
  reducers: {
    setNotification(state, action) {
      console.log('here is state ', state)
      console.log('here is payload ', action.payload)
      return action.payload
    },
    removeNotification(state, action) {
      return 'No notification'
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const setNotificationTimeout = (notification, timeout) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(setNotification('No notification')), timeout*1000)
  }
}

export default notificationSlice.reducer
