const express = require("express")
const Product = require("../models/product")
const Image = require("../models/image")
const auth = require("../middleware/adminAuth");
const router = new express.Router()

// Http endpoint for creating a product.
router.post("/product/create", auth, async (request, response) => {
	const product = new Product(request.body)
	
	try {
		await product.save()
		response.status(201).send(product)
	} catch (e) {
		response.status(400).send(e)
	}
})

// Http endpoints for retrieving all products.
router.get("/product/all", async (request, response) => {
	try {
		const products = await Product.find({})
		response.send(products)
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for retrieving a product.
router.get("/product/:id", async (request, response) => {
	const _id = request.params.id
	
	try {
		const product = await Product.findOne({ _id })
		
		if (!product) {
			response.status(404).send()
		}
		response.send(product)
		
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for updating a product
router.patch("/product/update/:id", auth, async (request, response) => {
	const updates = Object.keys(request.body)
	const allowedUpdates = ["name", "category", "quantity", "price", "availability", "serveWith"]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	
	if (!isValidOperation) {
		return response.status(400).send({
			error: "Invalid updates!"
		})
	}
	
	try {
		const product = await Product.findOne({ _id: request.params.id})
		
		if (!product) {
			response.status(400).send()
		}
		
		updates.forEach((update) => product[update] = request.body[update])
		await product.save()
		response.send(product)
		
	} catch (e) {
		response.status(500).send()
	}
})

// Http endpoint for deleting a product.
router.delete("/product/delete/:id", auth, async (request, response) => {
	try {
		const product = await Product.findOneAndDelete({ _id: request.params.id })

		if (!product) {
			return response.status(404).send()
		}
		response.send(product)
		
	} catch (e) {
		response.status(500).send(e)
	}
})


// Http endpoint for viewing a product image.
router.get("/product/:id/image", async (request, response) => {
	try {
		const product = await Product.findById(request.params.id)
		
		if (!product) {
			throw new Error()
		}
		
		const prodImage = await Image.findOne({ name: product.imageName })

		response.set("Content-Type", "image/png")
		response.send(prodImage.image)
	} catch (e) {
		response.status(404).send()
	} 
})

module.exports = router
