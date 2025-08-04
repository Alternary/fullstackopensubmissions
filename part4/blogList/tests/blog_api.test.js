const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const username = 'root'
const password = 'sekret'

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username: username, passwordHash })

  await user.save()

  //now, fetch the user id and save it into initialBlogs
  const users = await User.find({})
  const firstUserId = users[0].id.toString()
  // console.log("first user id ", firstUserId)

  // await Blog.deleteMany({})
  // await Blog.insertMany(helper.initialBlogs)

  const blogs = helper.initialBlogs
  for (blog of blogs) {
    blog.user = firstUserId
  }
  // console.log("here are blogs before tests ", blogs)

  //the mongoose schema turns the string userIds into objects in insertMany
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)

  // const newBlogs = await helper.blogsInDb()
  // console.log("new blogs ", newBlogs)

  const foundBlogs = await Blog.find({})
  // console.log("here in beforeEach, blogs be ", foundBlogs)
})

describe('returning blogs', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('returned blogs have a field called "id"', async () => {
    const blogs = await helper.blogsInDb()
    const idKeys = blogs.map(blog => Object.keys(blog).filter(key => key === "id"))
    // console.log("id keys ", idKeys)
    idKeys.forEach(keys => {
      // console.log("keys ", keys)
      assert.deepStrictEqual(keys, ["id"])
    })
  })
})

let token

describe.only('adding blogs when there exists a user', () => {
  beforeEach(async () => {
    const login = {
      username: username,
      password: password
    }
    const loginResponse = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    token = loginResponse.body.token
    // console.log("here is login response token ", token)
  })

  test('a valid blog can be added ', async () => {
    const users = await helper.usersInDb()
    const firstUser = users[0]

    const newBlog = {
      title: "title1",
      author: "author1",
      url: "url1",
      likes: 1,
      user: firstUser.id
    }

    //somehow need to the request add a `Bearer ${token}`
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('title1'))
  })

  test('a blog without likes can be added ', async () => {
    const users = await helper.usersInDb()
    const firstUser = users[0]

    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: "title2",
      author: "author2",
      url: "url2",
      user: firstUser.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd.filter(blog => !JSON.stringify(blogsAtStart).includes(JSON.stringify(blog)))[0]
    // console.log("addedBlog ", addedBlog)
    assert(addedBlog.likes === 0)
  })

  test('a blog without title can\'t be added ', async () => {
    const users = await helper.usersInDb()
    const firstUser = users[0]

    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: "author2",
      url: "url2",
      user: firstUser.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert(JSON.stringify(blogsAtStart) == JSON.stringify(blogsAtEnd))
  })

  test('a blog without url can\'t be added ', async () => {
    const users = await helper.usersInDb()
    const firstUser = users[0]

    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: "title2",
      author: "author2",
      user: firstUser.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert(JSON.stringify(blogsAtStart) == JSON.stringify(blogsAtEnd))
  })

  test('a blog without a token can\'t be added ', async () => {
    const users = await helper.usersInDb()
    const firstUser = users[0]

    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: "title2",
      url: "url2",
      user: firstUser.id
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    assert(JSON.stringify(blogsAtStart) == JSON.stringify(blogsAtEnd))
    assert(result.body.error.includes('token missing or invalid'))
  })

  // test('a blog without user can be added ', async () => {
  //   const users = await helper.usersInDb()
  //   const firstUser = users[0]
  //
  //   const blogsAtStart = await helper.blogsInDb()
  //
  //   const newBlog = {
  //     title: "title2",
  //     author: "author2",
  //     url: "url2"
  //   }
  //
  //   await api
  //     .post('/api/blogs')
  //     .send(newBlog)
  //     .expect(201)
  //
  //   const blogsAtEnd = await helper.blogsInDb()
  //
  //   assert(blogsAtEnd.length === helper.initialBlogs.length + 1)
  // })
})

describe('deleting blogs', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const soughtBlog = await Blog.findById(blogToDelete.id)
    // console.log("here is nonExistingBlog ", soughtBlog)
    assert(soughtBlog === null)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 400 if id is malformed', async () => {
    const malformedId = "xd"

    await api
      .delete(`/api/blogs/${malformedId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('succeeds with status code 204 if id is not found', async () => {
    const nonExistingId = "688b677aaaaaaaaaaaae1af0"

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating blogs when there exists a user', () => {
  test('updating blog updates blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // console.log("blogs at start ", blogsAtStart)
    const oldBlog = blogsAtStart[0]
    const blogIdString = oldBlog.id.toString()
    let updatedBlog = structuredClone(oldBlog)
    updatedBlog.user = oldBlog.user.toString()
    updatedBlog.likes += 1
    // console.log("old blog ", oldBlog)
    // console.log("new blog ", updatedBlog)
    // console.log("this is blog id string ", blogIdString)

    await api
      .put(`/api/blogs/${blogIdString}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const soughtBlog = await Blog.findById(blogIdString)

    // console.log("here are blogs ", soughtBlog, oldBlog)
    assert(soughtBlog.likes === oldBlog.likes + 1)

    assert(helper.initialBlogs.length === blogsAtEnd.length)
  })

  test('updating blog with malformed id fails with status code 400', async () => {
    const blogId = "xd"

    await api
      .put(`/api/blogs/${blogId}`)
      .expect(400)
  })

  test('fails with status code 404 if id is not found', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
