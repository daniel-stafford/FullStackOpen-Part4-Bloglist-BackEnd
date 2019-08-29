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

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}
