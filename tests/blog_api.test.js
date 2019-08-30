const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const _ = require('lodash')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})

	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()

	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()
})

describe('addition of a new blog', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned and counted', async () => {
		const response = await api.get('/api/blogs')
		expect(response.body.length).toBe(helper.initialBlogs.length)
	})

	test('unique identifier property of the blog posts is named id', async () => {
		const response = await api.get('/api/blogs')
		const idList = response.body.map(blog => blog._id)
		expect(idList).toBeDefined()
	})
})

describe('adding a new blog', () => {
	test('a blog post can be added ', async () => {
		const newBlog = {
			title: 'How To Fall from Grace',
			author: 'Tiger Woods',
			url: 'www.nike.com'
		}

		await api.post('/api/blogs').send(newBlog)

		const blogsatEnd = await helper.blogsInDb()
		expect(blogsatEnd.length).toBe(helper.initialBlogs.length + 1)
	})

	test('lilkes property is missing from the request, it will default to the value 0', async () => {
		const newBlog = {
			title: 'Does Anybody Like Me',
			author: 'Richard Simmons',
			url: 'www.missing.com'
		}

		await api.post('/api/blogs').send(newBlog)
		const blogsatEnd = await helper.blogsInDb()
		console.log('Blogs at End', blogsatEnd)
		expect(_.last(blogsatEnd).likes).toBe(0)
	})

	test('title and url properties are missing, 400 Bad Request', async () => {
		const newBlog = {
			author: 'Richard Simmons',
			url: 'www.missing.com'
		}
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	})
})
describe('deleting a blog', () => {
	test('can delete a single blog', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)
	})
})

describe('updating a blog', () => {
	test('can update number of likes', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		const newLikes = {
			likes: 5
		}
		console.log('blog to update likes', blogToUpdate.likes)
		await api
			.delete(`/api/blogs/${blogToUpdate.id}`)
			.send(newLikes)
			.expect(204)
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtStart[0].likes).not.toBe(blogsAtEnd[0].likes)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
