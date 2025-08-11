import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      console.log('in blogSlice here is state ', state)
      console.log('in blogSlice here is payload ', action.payload)
      return action.payload
    },
    likeBlog(state, action) {
      const id = action.payload
      const blogToChange = state.find(b => b.id === id)
      console.log('here is blog to vote for ', blogToChange)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state.map(blog =>
        blog.id !== id ? blog : changedBlog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    // commentBlog(state, action) {
    //   const id = action.payload.id
    //   const comment = action.payload.comment
    //   const blogToChange = state.find(b => b.id === id)
    //   const blogComments = blogToChange.comments
    //   const changedBlog = {
    //     ...blogToChange,
    //     comments:
    //       blogComments === undefined
    //       ? [comment]
    //       : blogComments.concat(comment)
    //   }
    //   return state.map(blog =>
    //     blog.id !== id ? blog : changedBlog
    //   )
    // }
  }
})

export const { setBlogs, createBlog, likeBlog, deleteBlog,
  // commentBlog
} = blogSlice.actions

export default blogSlice.reducer
