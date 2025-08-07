// import { useContext } from 'react'
import { useNotificationValue } from '../NotificationContext.jsx'

const Notification = () => {
  // const [notification, notificationDispatch] = useContext(NotificationContext)
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (false) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
