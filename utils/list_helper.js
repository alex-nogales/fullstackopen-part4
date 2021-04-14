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

module.exports = {
    dummy, totalLikes, favoriteBlog
}