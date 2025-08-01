const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('returning blogs', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('returned blogs\' id field is called "id"', async () => {
    const blogs = await helper.blogsInDb()
    // console.log("hey ", blogs)
    const blogIdKeys = blogs.map(blog => Object.keys(blog)[4])
    // console.log("idKeys ",blogIdKeys)
    const nonIdKeys = blogIdKeys.filter(key => key !== "id")
    assert.deepStrictEqual(nonIdKeys, [])
  })
})

describe('adding blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "title1",
      author: "author1",
      url: "url1",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('title1'))
  })

  test('a blog without likes can be added ', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: "title2",
      author: "author2",
      url: "url2"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const addedBlog = blogsAtEnd.filter(blog => ! JSON.stringify(blogsAtStart).includes(JSON.stringify(blog)))[0]
    // console.log("addedBlog ", addedBlog)
    assert(addedBlog.likes === 0)
  })

  test('a blog without title or url can\'t be added ', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      author: "author2",
    }

    // console.log("here")
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert(JSON.stringify(blogsAtStart) == JSON.stringify(blogsAtEnd))
  })
})

describe('deleting blogs', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const soughtBlog = await Blog.findById(blogToDelete.id)
    // console.log("here is nonExistingBlog ", soughtBlog)
    assert(soughtBlog === null)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 400 if id is malformed', async () => {
    const malformedId = "xd"

    await api.delete(`/api/blogs/${malformedId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('succeeds with status code 204 if id is not found', async () => {
    const nonExistingId = "688b677aaaaaaaaaaaae1af0"

    await api.delete(`/api/blogs/${nonExistingId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('updating blogs', () => {
  test('updating blog updates blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const oldBlog = blogsAtStart[0]
    const blogId = oldBlog.id
    let updatedBlog = structuredClone(oldBlog)
    updatedBlog.likes += 1

    await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const soughtBlog = await Blog.findById(blogId)

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

  test('succeeds with status code 404 if id is not found', async () => {
    const nonExistingId = "688b677aaaaaaaaaaaae1af0"

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })
})


/* USER TESTS */

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
