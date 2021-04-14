/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title === undefined ? response.status(400).end() : body.title,
        author: body.author,
        url: body.url === undefined ? response.status(400).end() : body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const actualBlog = await Blog.findById(request.params.id)
    const newBlog = {
        title: body.title === undefined ? actualBlog.title : body.title,
        author: body.author === undefined ? actualBlog.author : body.author,
        likes: body.likes === undefined ? actualBlog.likes : body.likes,
        url: body.url === undefined ? actualBlog.url : body.url
    }

    const blog = await Blog
        .findByIdAndUpdate(request.params.id, newBlog, {
            new: true
        })
    response.json(blog.toJSON())

})

/* app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {
        new: true
    })
        .then(updatedPerson => {
            if(updatedPerson) {
                response.json(updatedPerson.toJSON())
            } else {
                response.status(404).end()
            }
        })
        // eslint-disable-next-line no-undef
        .catch(error => next(error))

})
 */


module.exports = blogsRouter



