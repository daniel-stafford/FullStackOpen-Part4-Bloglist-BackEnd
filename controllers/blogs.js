const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
	try {
		const blogs = await Blog.find({})
			.populate('user', {
				username: 1,
				name: 1,
				id: 1
			})
			.populate('comments', {
				comment: 1
			})
		response.json(blogs)
	} catch (error) {
		next(error)
	}
})

blogsRouter.post('/', async (request, response, next) => {
	const body = request.body
	const token = request.token

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
		}

		const user = await User.findById(decodedToken.id)
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
	const token = request.token
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
		}
		const user = await User.findById(decodedToken.id)
		const blog = await Blog.findById(request.params.id)
		if (blog.user.toString() === user.id.toString()) {
			await Blog.findByIdAndRemove(request.params.id)
			response.status(204).end()
		} else {
			response
				.status(401)
				.json({ error: 'User is only able to delete own posts' })
		}
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

//add comments
blogsRouter.post('/:id/comments', async (request, response, next) => {
	const body = request.body
	try {
		if (body.comment === null) {
			response.status(400).end()
		}

		const comment = new Comment({
			comment: body.comment,
			blog: request.params.id
		})

		const savedComment = await comment.save()
		const blog = await Blog.findById(request.params.id)
		blog.comments = blog.comments.concat(savedComment.id)
		await blog.save()
		response.status(201).json(savedComment.toJSON())
	} catch (exception) {
		next(exception)
	}
})

module.exports = blogsRouter
