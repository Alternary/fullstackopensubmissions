import { createContext, useReducer, useContext } from 'react'
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

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
  }
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] =
    useReducer(notificationReducer, 0)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const setNotificationTimeout = (notification, timeout) => {
  return async dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(setNotification('No notification')), timeout*1000)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions

export default NotificationContext
