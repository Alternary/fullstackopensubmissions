const Notification = ({notification}) => {
  if (notification[0] === null) {
    return null
  }

  return (
    <div className="error"
      style={
        // {color: {notification.length > 1 ? notification[1] : "green"}}
        {color: `${notification.length > 1 ? notification[1] : "green"}`}
      }
      // {notification.length > 1
      //   ? style="color:"+notification[1]
      //   : ""
      // }
    >
      {notification[0]}
    </div>
  )
}

export default Notification
