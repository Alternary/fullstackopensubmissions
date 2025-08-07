import { useSelector } from 'react-redux'
import notificationReducer, { setNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const notification = useSelector(({ filter, anecdotes, notification }) => {
    return notification
  })
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
