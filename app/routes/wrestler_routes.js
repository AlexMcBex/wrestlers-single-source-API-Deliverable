// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for wrestlers
const Wrestler = require('../models/wrestler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { wrestler: { title: '', text: 'foo' } } -> { wrestler: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /wrestlers
router.get('/wrestlers', (req, res, next) => {
	Wrestler.find()
		.populate('owner')
		.then((wrestlers) => {
			// `wrestlers` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return wrestlers.map((wrestler) => wrestler.toObject())
		})
		// respond with status 200 and JSON of the wrestlers
		.then((wrestlers) => res.status(200).json({ wrestlers: wrestlers }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /wrestlers/:id
router.get('/wrestlers/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Wrestler.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "wrestler" JSON
		.then((wrestler) => res.status(200).json({ wrestler: wrestler.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /wrestlers
router.post('/wrestlers', requireToken, (req, res, next) => {
	// set owner of new wrestler to be current user
	req.body.wrestler.owner = req.user.id

	Wrestler.create(req.body.wrestler)
		// respond to succesful `create` with status 201 and JSON of new "wrestler"
		.then((wrestler) => {
			res.status(201).json({ wrestler: wrestler.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /wrestlers/:id
router.patch('/wrestlers/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.wrestler.owner

	Wrestler.findById(req.params.id)
		.then(handle404)
		.then((wrestler) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, wrestler)

			// pass the result of Mongoose's `.update` to the next `.then`
			return wrestler.updateOne(req.body.wrestler)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /wrestlers/:id
router.delete('/wrestlers/:id', requireToken, (req, res, next) => {
	Wrestler.findById(req.params.id)
		.then(handle404)
		.then((wrestler) => {
			// throw an error if current user doesn't own `wrestler`
			requireOwnership(req, wrestler)
			// delete the wrestler ONLY IF the above didn't throw
			wrestler.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
