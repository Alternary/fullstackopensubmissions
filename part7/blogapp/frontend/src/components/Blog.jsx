import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { setBlogs, createBlog, likeBlog, deleteBlog,
//   commentBlog
} from '../reducers/blogReducer'
import storage from '../services/storage'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams
} from 'react-router-dom'
import { Table, Form, Button } from 'react-bootstrap'
import blogService from '../services/blogs'

const Blog = ({ blogs, handleVote, handleDelete }) => {
  const dispatch = useDispatch()

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  const [comment, setComment] = useState('')

  // const [visible, setVisible] = useState(true)
  const visible = true

  if (!blog) { return null }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous'

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove = blog.user ? blog.user.username === storage.me() : true

  console.log(blog.user, storage.me(), canRemove)

  // const handleComment = (event) => {
  //   event.preventDefault()
  //   blogService.comment(comment, id)
  //   dispatch(commentBlog({ id: id, comment: comment }))
  //   setComment('')
  // }

  return (
    <div style={style} className='blog'>
      <h2>{blog.title} {blog.author}</h2>
      {/*<button style={{ marginLeft: 3 }} onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>*/}
      {visible && (
        <div>
          <div><a href={`//${blog.url}`}>{blog.url}</a></div>
          <div>
            {blog.likes} likes
            <button
              style={{ marginLeft: 3 }}
              onClick={() => handleVote(blog)}
            >
              like
            </button>
          </div>
          <div>{`added by ${nameOfUser}`}</div>
          {canRemove && <button onClick={() => handleDelete(blog)}>
            remove
          </button>}
        </div>
      )}
      {/*<Form onSubmit={handleComment}>
        <Form.Group>
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">add comment</Button>
      </Form>*/}
      {blog.comments !== undefined &&
        <ul>
          {blog.comments.map((comment, index) =>
            <li key={index}>{comment}</li>
          )}
        </ul>
      }
    </div>
  )
}

Blog.propTypes = {
  // blog: PropTypes.shape({
  //   url: PropTypes.string.isRequired,
  //   title: PropTypes.string.isRequired,
  //   likes: PropTypes.number.isRequired,
  //   user: PropTypes.object,
  // }).isRequired,
  handleVote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default Blog
