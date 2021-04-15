const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = helper.initialBlog
        .map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})
    const newUser = new User({
        username: 'anogales',
        passwordHash: await bcrypt.hash('password', 10)
    })
    await newUser.save()

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
        author: 'Luthien',
        url: 'http:12313.ocm'
    }

    const response = await api.post('/api/login')
        .send({ username: 'anogales', password: 'password' })

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${response.body.token}`)
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
        author: 'Luthien',
        url: 'faceboad.com'
    }
    const token = await api.post('/api/login').send({ username: 'anogales', password: 'password' })

    const { body } = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token.body.token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(body.map(l => l.likes).includes(undefined)).not.toBe(true)
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



describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10 )
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'anogales',
            name: 'Alex Nogales',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length + 1)

        const usernames = userAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'SuperUser',
            password: 'clavecita'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})

afterAll(() => {
    mongoose.connection.close()
})