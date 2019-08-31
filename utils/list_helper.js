const _ = require('lodash')

const dummy = blogs => {
	blogs
	return 1
}

const totalLikes = blogs => {
	const reducer = (sum, item) => {
		return sum + item
	}
	console.log('blogs length', blogs.length)
	return blogs.length === 0
		? 0
		: blogs.map(blog => blog.likes).reduce(reducer, 0)
}
const favoriteBlog = blogs => {
	const model = {
		title: null,
		author: null,
		likes: null
	}
	if (blogs.length === 0) return []

	let favBlog = _.sortBy(blogs, ['likes']).pop()
	favBlog = _.pick(favBlog, _.keys(model))

	return favBlog
}

const mostBlogs = blogs => {
	const authorArray = _.map(blogs, 'author') //create an array of author values from the object array
	const author = _.head(
		_(authorArray)
			.countBy()
			.entries()
			.maxBy(_.last)
	)
	const totalBlogs = blogs.filter(blog => blog.author === author).length
	const result = {
		author,
		blogs: totalBlogs
	}
	return result
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs
}
