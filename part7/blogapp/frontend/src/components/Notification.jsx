import { useSelector } from 'react-redux'
import notificationReducer, { setNotificationTimeout } from '../reducers/notificationReducer'
// import { Alert } from 'react-bootstrap'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector(({ user, blogs, notification }) => notification)

  if (!notification) {
    return null
  }

  const { message, type } = notification

  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: type === 'success' ? 'green' : 'red',
    borderRadius: '5px',
  }

  return (
    <>
    {/*<div style={style}>
      {message}
    </div>*/}
    {/*<Alert className={
      type === 'success'
      ? 'alert alert-success'
      : 'alert alert-danger'
    }>*/}
    <Alert
      variant="filled"
      severity={type}
    >
      {message}
    </Alert>
    </>
  )
}

export default Notification
