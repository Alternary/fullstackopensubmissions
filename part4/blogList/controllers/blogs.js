const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  // console.log("here is request ", request)
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

  const keys = Object.keys(body)
  if (!keys.includes('title') || !keys.includes("url")) {
    return response.status(400)
      .json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: keys.includes("likes") ? body.likes : 0
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  // // console.log("here is user ", user)
  //
  // if (!user) {
  //   return response.status(400).json({ error: 'UserId missing or not valid' })
  // }
  //
  // //check whether the blog to be deleted is owned by the user
  // const blogToBeDeleted = await Blog.findById(request.params.id)
  // console.log("here is blog to be deleted ", blogToBeDeleted)
  // if (blogToBeDeleted.user.toString() !== user._id.toString()) {
  //   return response.status(401).json({ error: 'this user does not have authorization to delete this blog' })
  // }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const keys = Object.keys(body)

  let blog = await Blog.findById(request.params.id)
  if (!blog) {
    response.status(404).end()
  }
  blog.title = keys.includes("title") ? body.title : blog.title
  blog.author = keys.includes("author") ? body.author : blog.author
  blog.url = keys.includes("url") ? body.url : blog.url
  blog.likes = keys.includes("likes") ? body.likes : blog.likes
  blog.user = keys.includes("user") ? body.user : blog.user
  await blog.save()

  const user = await User.findById(blog.user)
  user.blogs = user.blogs.concat(blog.user)
  await user.save()

  // Blog.findById(request.params.id)
  //   .then(blog => {
  //     if (!blog) {
  //       return response.status(404).end()
  //     }
  //
  //     blog.title = title
  //     blog.author = author
  //     blog.url = url
  //     blog.likes = likes
  //
  //     return blog.save().then((updatedBlog) => {
  //       response.json(updatedBlog)
  //     })
  //   })
  //   .catch((error) => next(error))
  response.status(200).json(blog)
})

module.exports = blogsRouter
