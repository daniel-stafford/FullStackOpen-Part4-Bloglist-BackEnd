const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
	const body = request.body
	if (body.password.length < 3 || body.password.length < 3)
		return response.status(400).json({
			error: 'password and username must be at least 3 characters long'
		})

	try {
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(body.password, saltRounds)

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash
		})
		const savedUser = await user.save()
		response.json(savedUser)
	} catch (exception) {
		next(exception)
	}
})

module.exports = usersRouter
