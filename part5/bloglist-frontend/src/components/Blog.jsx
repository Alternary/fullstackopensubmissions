import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, deleteBlogInApp, likeBlogInApp }) => {
  const [viewBlog, setViewBlog] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleViewBlog = () => {
    setViewBlog(!viewBlog)
    console.log('here is blog ', blog)
  }

  const blogStyle = {
    borderWidth: 1,
    border: 'solid'
  }

  const likeBlog = () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1,
      user: blog.user.id
    }
    console.log('this is blog id ', blog.id)
    console.log('this is user ', blog.user)
    blogService.update(blog.id, newBlog)
    setLikes(likes+1)
    // likeBlogInApp(blog.id, newBlog)
    likeBlogInApp()
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.remove(blog.id)
    }
    else {
      console.log('didn\'t delete blog')
    }
    deleteBlogInApp(blog.id)
  }

  return (
    <div>
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleViewBlog}>{!viewBlog ? 'view' : 'hide'}</button>
        {viewBlog && <>
          <br></br>{blog.url}
          <br></br>likes {likes}
          <button onClick={likeBlog}>like</button>
          <br></br>{blog.user.name}
          <br></br>
          <button onClick={deleteBlog}>delete</button>
        </>}
      </div>
    </div>
  )
}

export default Blog
