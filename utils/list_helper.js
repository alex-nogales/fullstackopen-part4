const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) =>  {
    return blogs.reduce((total, current) => total + current.likes, 0)
}

const favoriteBlog = (blogs) => {
    const likes = blogs.map((blog) => blog.likes)
    const maxLike = blogs.filter(blog => blog.likes === Math.max(...likes))[0]
    return {
        title: maxLike.title,
        author: maxLike.author,
        likes: maxLike.likes
    }
}



/* var services = ['weibo', 'facebook', 'twitter', 'xing'];
var result = _.map(services, function(service){
     var length = _.reject(array, function(el){
           return (el.id.indexOf(service) < 0);
     }).length;
     return {id: service, count: length};
}); */

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author).filter((value, index, self) => self.indexOf(value) === index)
    return 0
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
}