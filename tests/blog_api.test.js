const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const _ = require('lodash')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
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
		const idList = response.body.map(blog => blog.id)
		expect(idList).toBeDefined()
	})
})

describe('adding a new blog', () => {
	test('a blog post can be added ', async () => {
		const newUser = { username: 'admin', password: 'salasana' }

		// create user
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/',
			likes: 22
		}

		//post blog with token in header
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAfter = await helper.blogsInDb()
		expect(blogsAfter.length).toBe(helper.initialBlogs.length + 1)
	})

	test('lilkes property is missing from the request, it will default to the value 0', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//blog without likes
		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/'
		}

		//post blog with token in header
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsatEnd = await helper.blogsInDb()
		expect(_.last(blogsatEnd).likes).toBe(0)
	})

	test('title property is missing, 400 Bad Request', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//blog without title
		const newBlog = {
			author: 'John Smith',
			url: 'http://www.jsmith.com/'
		}

		//post blog with token in header
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(400)
	})

	test('url property is missing, 400 Bad Request', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//blog without title
		const newBlog = {
			title: 'this is  blog',
			author: 'John Smith'
		}

		//post blog with token in header
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(400)
	})
})

describe('deleting a blog', () => {
	test('user can delete own blog', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//properly formatted blog
		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/',
			likes: 22
		}

		//post blog with token in header
		const blogToDelete = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAfterPost = await helper.blogsInDb()
		console.log('blogs after post!!!!', blogsAfterPost)

		//delete blog with token in header
		await api
			.delete(`/api/blogs/${blogToDelete.body.id}`)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		console.log('blogs at end!!!', blogsAtEnd)
		expect(blogsAfterPost.length).not.toBe(blogsAtEnd.length)
	})
	test('user cannot delete blog without token', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//properly formatted blog
		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/',
			likes: 22
		}

		//post blog with token in header
		const blogToDelete = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		//delete blog without token in header
		await api.delete(`/api/blogs/${blogToDelete.body.id}`).expect(500)
	})
	test('wrong user tries to delete blog', async () => {
		// create rightful user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//properly formatted blog
		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/',
			likes: 22
		}

		//post blog with token in header
		const blogToDelete = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		// create wrongful user
		const wrongUser = { username: 'wrongUser', password: 'salasana' }
		await api
			.post('/api/users')
			.send(wrongUser)
			.expect(200)

		// login user
		const loginWrongUser = await api
			.post('/api/login')
			.send(wrongUser)
			.expect(200)

		//delete blog with wrong user's token in header
		await api
			.delete(`/api/blogs/${blogToDelete.body.id}`)
			.set('Authorization', `bearer ${loginWrongUser.body.token}`)
			.expect(401)
	})
})

describe('updating a blog', () => {
	test('can update number of likes', async () => {
		// create user
		const newUser = { username: 'admin', password: 'salasana' }
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)

		// login user
		const login = await api
			.post('/api/login')
			.send(newUser)
			.expect(200)

		//blog with 22 likes
		const newBlog = {
			title: 'This is a blog',
			author: 'John Smith',
			url: 'http://www.jsmith.com/',
			likes: 22
		}

		//post blog with token in header
		const blogToUpdate = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const newLikes = {
			likes: 5
		}
		//update blog likes with token in header
		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.body.id}`)
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newLikes)
			.expect(200)

		expect(blogToUpdate.body.id).toBe(updatedBlog.body.id)
		expect(blogToUpdate.body.likes).toBe(22)
		expect(updatedBlog.body.likes).toBe(newLikes.likes)
	})
})

afterAll(() => {
	mongoose.connection.close()
})
