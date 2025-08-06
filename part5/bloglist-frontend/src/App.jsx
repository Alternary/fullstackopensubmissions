import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import PropTypes from 'prop-types'
import Togglable from './components/Togglable'
import BlogCreationForm from './components/BlogCreationForm'

const Notification = ({ notification }) => {
  return (
    <div style={ { background: 'lightgrey' } }>
      { notification }
    </div>
  )
}

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          data-testid='username'
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

const App = () => {
  // const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')

  const [notification, setNotification] = useState(['Notification area'])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('logged in')
      setTimeout(() => {
        setNotification('Notification area')
      }, 3000)
    } catch (exception) {
      console.log('here is exception ', exception)
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification('Notification area')
      }, 3000)
    }
  }

  const logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setNotification('logged out')
    setTimeout(() => {
      setNotification('Notification area')
    }, 3000)
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel='log in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const blogRef=useRef() //will I use this?

  const deleteBlogInApp = (id) => {
    setBlogs(blogs.filter(b => b.id !== id))
  }

  // const likeBlogInApp = (id, newBlog) => {
  //   // let newBlogs = blogs
  //   // newBlogs.find(b => b.id === id).likes += 1
  //   const unchangedBlogs = blogs.filter(b => b.id !== id)
  //   console.log('there are this many unchanged blogs ', unchangedBlogs.length)
  //   const newBlogs = unchangedBlogs.concat(newBlog)
  //   setBlogs(newBlogs)
  // }

  const likeBlogInApp = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }

  const toggleViewOf = id => {

  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p> <button onClick={logout}>logout</button>
        {blogs.sort((b1,b2) => b2.likes-b1.likes).map(blog =>
          <Blog key={blog.id} blog={blog} deleteBlogInApp={deleteBlogInApp} likeBlogInApp={likeBlogInApp} />
        )}
        {/*<BlogList blogs={blogs} deleteBlogInApp={deleteBlogInApp} likeBlogInApp={likeBlogInApp} />*/}
        <h2>create new</h2>
        <BlogCreationForm setBlogs={setBlogs} setNotification={setNotification} />
      </div>}
    </div>
  )
}

// const BlogList = ({ blogs, deleteBlogInApp, likeBlogInApp }) => {
//   return (<>
//     blogs
//       .sort((b1,b2)=>b2.likes-b1.likes)
//       .map(blog =>
//         <Blog key={blog.id} blog={blog} deleteBlogInApp={deleteBlogInApp} likeBlogInApp={likeBlogInApp} />
//     )}
//   </>)
// }

export default App
