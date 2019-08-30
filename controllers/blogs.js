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
	const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true
	})
	try {
		response.json(updatedNote.toJSON())
	} catch (e) {
		next(e)
	}
})

module.exports = blogsRouter
