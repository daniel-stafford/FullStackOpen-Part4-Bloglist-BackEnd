const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/'
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5
	}
]

const initialUsers = [
	{
		username: 'root',
		name: 'Daniel Stafford',
		password: 'abc123'
	},
	{
		username: 'fsmith',
		name: 'Frank Smith',
		password: 'abc123'
	}
]

const nonExistingId = async () => {
	const blog = new Blog({ content: 'willremovethissoon' })
	await blog.save()
	await blog.remove()
	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingId,
	initialUsers,
	blogsInDb,
	usersInDb
}
