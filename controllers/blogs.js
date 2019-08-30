const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		id: 1
	})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body

	try {
		const user = await User.findOne({})
		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user._id
		})
		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.status(201).json(savedBlog.toJSON())
	} catch (error) {
		next(error)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	await Blog.findByIdAndRemove(request.params.id)
	try {
		response.status(204).end()
	} catch (error) {
		next(error)
	}
})

// update likes
blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body
	const blog = {
		likes: body.likes
	}
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true
	})
	try {
		response.json(updatedBlog.toJSON())
	} catch (e) {
		next(e)
	}
})

module.exports = blogsRouter
