// eslint-disable-next-line no-unused-vars
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

app.use('/api/blogs', blogsRouter)

app.use(cors())
app.use(express.json())

// eslint-disable-next-line no-undef
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})