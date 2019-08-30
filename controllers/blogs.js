const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
	Blog.find({}).then(blogs => {
		response.json(blogs)
	})
})

blogsRouter.post('/', async (request, response, next) => {
	const blog = new Blog(request.body)
	try {
		const savedNote = await blog.save()
		response.status(201).json(savedNote.toJSON())
	} catch (error) {
		next(error)
	}
})

module.exports = blogsRouter
