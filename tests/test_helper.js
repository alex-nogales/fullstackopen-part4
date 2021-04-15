const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
    { title: 'Blog 1', author: 'Author 1', url: 'http://url1.com', likes: 10 },
    { title: 'blog 2', author: 'author 2', url: 'http://url2.com', likes: 5 },
    { title: 'blog 3', author: 'author 3', url: 'http://url3.com', likes: 8 }
]

const nonExistingId = async () => {
    const blog = new Blog ({ title: 'willremovethissoon' })
    await blog.save()
    await blog.remove()

    return blog.id
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlog, nonExistingId, blogsInDb, usersInDb
}
