const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = helper.initialBlog
        .map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
})


test('Blogs returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('Does it have ID?', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.map(r => r.id)).not.toBe(undefined)
})

test('Test http post', async () => {
    const newBlog = {
        title: 'Test blog',
        author: 'Luthien'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlog.length + 1)

    const content = blogsAtEnd.map(r => r.title)
    expect(content).toContain('Test blog')
})

test('Likes missing', async () => {
    const newBlog = {
        tilte: 'Test blog',
        author: 'Luthien'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body.map(l => l.likes).includes(undefined)).not.toBe(true)
})

test('Missing tittle or url', async () => {
    const newBlog = {
        title: 'title1',
        author: 'Luthien',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('Retrieve one', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body.map(id => id.id)[0]

    await api
        .get(`/api/blogs/${id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


afterAll(() => {
    mongoose.connection.close()
})