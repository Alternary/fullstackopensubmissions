import { useState, useRef } from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'

const BlogCreationForm = ({
  setBlogs,
  setNotification
}) => {
  const [visible, setVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    console.log('in blog creation handler')
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    const response = await blogService.create(newBlog)
    console.log('response is ', response)
    const foundBlogs = await blogService.getAll()
    setBlogs(foundBlogs) //had to set blogs with foundBlogs, because by concatting newBlog, the newBlog lacks the id field entirely, because we don't set it here, so we need to fetch the new blog with blogService from the database. And along it we fetch the existing blogs because it's just simpler to fetch them all and then setBlogs() with all the foundBlogs combined
    // console.log('here are found blogs ', foundBlogs)
    // console.log('here are blog ids ', blogs.map(b=>b.id))
    setNotification(`a new blog ${title} by ${author} added`)
    setTimeout(() => {
      setNotification('Notification area')
    }, 3000)
    // setVisible(false)
    blogFormRef.current.toggleVisibility()
  }

  const blogFormRef = useRef()

  return (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <form onSubmit={handleBlogCreation}>
        <div>
          title:
          <input
            data-testid="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogCreationForm
