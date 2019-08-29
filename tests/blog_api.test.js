const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')

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

afterAll(() => {
	mongoose.connection.close()
})
