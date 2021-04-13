// eslint-disable-next-line no-unused-vars
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const Blog = require('./models/blog')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

// eslint-disable-next-line no-undef
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})