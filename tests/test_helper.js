const Blog = require('../models/blog')

const initialBlogs = [
	{
<<<<<<< HEAD
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7
	},
	{
=======
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0
	},
	{
		_id: '5a422aa71b54a676234d17f8',
>>>>>>> 9e2dc05096fd11fe02478c01e82e3b9ce3ac2ff0
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
<<<<<<< HEAD
		likes: 5
=======
		likes: 5,
		__v: 0
>>>>>>> 9e2dc05096fd11fe02478c01e82e3b9ce3ac2ff0
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

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb
}
