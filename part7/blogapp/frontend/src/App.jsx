import { useState, useEffect, createRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotificationTimeout } from './reducers/notificationReducer'
import { setBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { /* initializeUser,  */setUser/* , logoutUser */ } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from 'react-router-dom'
import { Table, Form, Button, Navbar, Nav, ListGroup } from 'react-bootstrap'
import { Container } from '@mui/material'

import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const dispatch = useDispatch()

  const blogs2 = useSelector(({ user, blogs, notification }) => blogs)
  const user2 = useSelector(({ user, blogs, notification }) => user)

  const [users, setUsers] = useState([])

  // const [blogs, setBlogs1] = useState([])
  // const [user1, setUser1] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      // setBlogs1(blogs)
      dispatch(setBlogs([...blogs]))
      // console.log('in useEffect, here are blogs ', blogs)
      console.log('in useEffect, here are blogs2 ', blogs2)
    })
  }, [])

  useEffect(() => {
    userService.getAll().then(users => setUsers(users))
  }, [])

  useEffect(() => {
    const user = storage.loadUser()
    let conditionalUser = user ? user : user2
    // if (user) {
    //   setUser1(user)
    // }
    dispatch(setUser(conditionalUser))
    // dispatch(initializeUser())
  }, [])

  const blogFormRef = createRef()

  const notify = (message, type = 'success') => {
    dispatch(setNotificationTimeout({ message, type }, 5))
  }

  const handleLogin = async (credentials) => {
    let user = user2
    try {
      user = await loginService.login(credentials)
      // setUser1(user)
      storage.saveUser(user)
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
    dispatch(setUser(user))
  }

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog)
    // setBlogs1(blogs.concat(newBlog))
    // dispatch(setBlogs([...blogs2].concat(newBlog)))
    dispatch(createBlog(newBlog))
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
    blogFormRef.current.toggleVisibility()
  }

  const handleVote = async (blog) => {
    console.log('updating', blog)
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1
    })

    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
    // setBlogs1(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    // dispatch(setBlogs([...blogs2].map(b => b.id === blog.id ? updatedBlog : b)))
    dispatch(likeBlog(blog.id))
  }

  const handleLogout = () => {
    // setUser1(null)
    dispatch(setUser(null))
    storage.removeUser()
    notify(`Bye, ${user2.name}!`)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      // setBlogs1(blogs.filter(b => b.id !== blog.id))
      // dispatch(setBlogs([...blogs2].filter(b => b.id !== blog.id)))
      dispatch(deleteBlog(blog.id))
      notify(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  const backgroundStyle = {
    background: "papayawhip",
    padding: "7px",
    paddingBottom: "99px"
  }

  if (!user2) {
    return (
      <div className="container" style={backgroundStyle}>
        <Login doLogin={handleLogin} />
        <h2>blog app</h2>
        <Notification /* notification={notification} */ />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes
  console.log('here are blogs2 ', blogs2)

  const menuStyle = {
    // background: "#DDDDDD",
    background: "burlywood",
    margin: "0px",
    padding: "7px"
  }

  const tbodyStyle = {
    background: "#DDDDDD"
  }

  const createBlogStyle = {
    margin: "3px",
    padding: "2px"
  }

  return (
    <Container>
    <div className="container" style={backgroundStyle}><Router>
      {/*<p>here is user2 {JSON.stringify(user2)}</p>*/}
      <div style={menuStyle} >
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="light"
          variant="light"
        >
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link to="/blogs">blogs </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/users">users</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Button variant="primary" onClick={handleLogout}>
            logout
          </Button>
        </Navbar>
        {/*<Link to="/blogs">{`blogs `}</Link>{' '}
        <Link to="/users">users {' '}</Link>{' '}
        {user2.name} logged in {' '}
        <Button variant="primary" onClick={handleLogout}>
          logout
        </Button>*/}
      </div>
      <h2>blog app</h2>
      <Notification /* notification={notification} */ />
      <Routes>
        <Route path="/blogs" element={
          <div>
            <div style={createBlogStyle}>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <NewBlog doCreate={handleCreate} />
            </Togglable>
            </div>
            <ListGroup as="ul" variant="flush">
            {/* blogs */[...blogs2].sort(byLikes).map(blog =>
              <ListGroup.Item variant="secondary" as="li" key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              {/*<Blog
                key={blog.id}
                blog={blog}
                handleVote={handleVote}
                handleDelete={handleDelete}
              />*/}
              </ListGroup.Item>
            )}
            </ListGroup>
          </div>
        } />
        <Route path="/users" element={
          <div>
            <h2>Users</h2>
            <Table bordered hover size="sm">
              <tbody style={tbodyStyle}>
                <tr><td></td><td><h3>blogs created</h3></td></tr>
              </tbody>
              {users.map(user =>
                <tbody key={user.id} style={tbodyStyle}><tr>
                  <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                  <td>{user.blogs.length}</td>
                </tr></tbody>
              )}
            </Table>
          </div>
        } />
        <Route path="/blogs/:id" element={<Blog blogs={blogs2} handleVote={handleVote} handleDelete={handleDelete} />} />
        <Route path="/users/:id" element={<User users={users} />} />
      </Routes>
    </Router>
    {/*<br></br>
    <br></br>
    <br></br>
    <br></br>*/}
    </div>
    </Container>
  )
}

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find(u => u.id === id)
  if (!user) {
    return null
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ListGroup as="ul">
        {user.blogs.map(blog =>
          <ListGroup.Item variant="secondary" as="li" key={blog.id}>{blog.title}</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}

export default App
