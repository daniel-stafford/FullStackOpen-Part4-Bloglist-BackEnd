const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const grabToken = (request, response, next) => {
	const token = request.header('Authorization')
	if (token.startsWith('Bearer ')) return token.slice(7, token.length)
	next()
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError' && error.kind === 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

module.exports = {
	requestLogger,
	grabToken,
	unknownEndpoint,
	errorHandler
}
