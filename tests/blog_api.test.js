const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlog[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlog[1])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlog[2])
    await blogObject.save()
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

test.only('Likes missing', async () => {
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

afterAll(() => {
    mongoose.connection.close()
})