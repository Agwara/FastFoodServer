const express = require("express")
const Admin = require("../models/admin")
const auth = require("../middleware/adminAuth")
const router = new express.Router()

// Http endpoint for creating a customer
router.post("/admin/create", async (request, response) => {
	const admin = new Admin(request.body)

	try {
		await admin.save()
		const token = await admin.generateAuthToken()
		response.status(201).send({
			admin,
			token
		})
	} catch (e) {
		response.status(400).send(e)
	}
})

// Http endpoint for logging-in a customer
router.post("/admin/login", async (request, response) => {
	try {
		const admin = await Admin.findByCredentials(request.body.email, request.body.password)
		const token = await admin.generateAuthToken()
		response.send({
			admin,
			token
		})
	} catch (e) {
		response.status(400).send({error: "Invalid email or password!"})
	}
})


// Http endpoint for logging-out from all sessions
router.post("/admin/logoutAll", auth, async (request, response) => {
	try {
		request.admin.tokens = []
		await request.admin.save()
		response.status(200).send()
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for retrieving a admin
router.get("/admin/me", auth, async (request, response) => {
	try {
		response.send(request.admin)
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoints for retrieving all admins
router.get("/admin/all", async (request, response) => {
	try {
		const admins = await Admin.find({})
		response.send(admins)
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for updating an admin
router.patch("/admin/me", auth, async (request, response) => {
	const updates = Object.keys(request.body)
	const allowedUpdates = ["firstName", "lastName", "email", "password", "phone"]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

	if (!isValidOperation) {
		return response.status(400).send({
			error: "Invalid updates!"
		})
	}

	try {
		updates.forEach((update) => request.admin[update] = request.body[update])
		await request.admin.save()
		response.send(request.admin)
	} catch (e) {
		response.status(400).send(e)
	}
})

// Http endpoint for deleting a admin
router.delete("/admin/me", auth, async (request, response) => {
	try {
		await Admin.deleteOne({ email: request.admin.email })
		response.send(request.admin)
	} catch (e) {
		response.status(500).send(e)
	}
})

module.exports = router
