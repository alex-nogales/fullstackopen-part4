/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const config = require('../utils/config')
const mongoUrl = config.MONGODB_URI
console.log('Connecting to: ', mongoUrl)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('Connected to the DB')
    })
    .catch((error) => {
        console.log('Error connecting to mongoDB: ', error.message)
    }
    )

module.exports = mongoose.model('Blog', blogSchema)