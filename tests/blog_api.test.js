const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlog = [
    { title: 'Blog 1', author: 'Author 1', url: 'http://url1.com', likes: 10 },
    { title: 'blog 2', author: 'author 2', url: 'http://url2.com', likes: 5 },
    { title: 'blog 3', author: 'author 3', url: 'http://url3.com', likes: 8 }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlog[0])
    await blogObject.save()
    blogObject = new Blog(initialBlog[1])
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

test.only('Test http post', async () => {
    let blogObject = new Blog(initialBlog[2])
    await blogObject.save()

    const response = await api.get('/api/blogs')
    const content = response.body.map(r => r.title)
    expect(content).toContain('blog 3')
})

afterAll(() => {
    mongoose.connection.close()
})