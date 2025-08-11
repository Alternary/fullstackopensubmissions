import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: 'No notification',
  type: 'success'
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setNotification(state, action) {
      console.log('here is state ', state)
      console.log('here is payload ', action.payload)
      return action.payload
    },
    removeNotification(state, action) {
      return initialState
    }
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const setNotificationTimeout = (notification, timeout) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(setNotification(initialState)), timeout*1000)
  }
}

export default notificationSlice.reducer
