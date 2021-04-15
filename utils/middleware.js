/* eslint-disable no-undef */
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body   ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    const bearerPrefix = 'bearer '
    if (authorization && authorization.toLowerCase().startsWith(bearerPrefix)) {
        request.token = authorization.substring(bearerPrefix.length)
    }
    next()
}

const userExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    const bearerPrefix = 'bearer '

    if(authorization && authorization.toLowerCase().startsWith(bearerPrefix)) {
        const token = jwt.verify(authorization.substring(bearerPrefix.length)
            ,process.env.SECRET)
        request.user = token.username
    }
    next()
}


const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    logger.error(error.message)

    next(error)
}

module.exports = ({
    requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor
})