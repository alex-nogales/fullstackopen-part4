// eslint-disable-next-line no-unused-vars
const app = require('./app')
const http = require('http')
const logger = require('./utils/logger')
const config = require('./utils/config')

const server = http.createServer(app)

// eslint-disable-next-line no-undef
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})