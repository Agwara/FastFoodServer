const express = require("express")
const Customer = require("../models/customer")
const auth = require("../middleware/customerAuth")
const router = new express.Router()

// Http endpoint for creating a customer
router.post("/customers", async (request, response) => {
	const customer = new Customer(request.body)

	try {
		await customer.save()
		const token = await customer.generateAuthToken()
		response.status(201).send({
			customer,
			token
		})
	} catch (e) {
		response.status(400).send(e)
	}
})

// Http endpoint for logging-in a customer
router.post("/customers/login", async (request, response) => {
	try {
		const customer = await Customer.findByCredentials(request.body.email, request.body.password)
		const token = await customer.generateAuthToken()
		response.send({
			customer,
			token
		})
	} catch (e) {
		response.status(400).send({error: "Invalid email or password!"})
	}
})


// Http endpoint for logging-out from all sessions
router.post("/customers/logoutAll", auth, async (request, response) => {
	try {
		request.customer.tokens = []
		await request.customer.save()
		response.status(200).send()
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for retrieving a customer
router.get("/customers/me", auth, async (request, response) => {
	try {
		response.send(request.customer)
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoints for retrieving all customers
router.get("/customers/all", async (request, response) => {
	try {
		const customers = await Customer.find({})
		response.send(customers)
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for updating a customer
router.patch("/customers/me", auth, async (request, response) => {
	const updates = Object.keys(request.body)
	const allowedUpdates = ["firstName", "lastName", "email", "password", "phone"]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return response.status(400).send({
			error: "Invalid updates!"
		})
	}

	try {
		updates.forEach((update) => request.customer[update] = request.body[update])
		await request.customer.save()
		response.send(request.customer)
	} catch (e) {
		response.status(400).send(e)
	}
})

// Http endpoint for deleting a customer
router.delete("/customers/me", auth, async (request, response) => {
	try {
		await Customer.deleteOne({ email: request.customer.email })
		response.send(request.customer)
	} catch (e) {
		response.status(500).send(e)
	}
})

module.exports = router
