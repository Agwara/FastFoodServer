const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const Product = require("../models/product")
const auth = require("../middleware/AdminAuth")
const router = new express.Router()

// Http endpoint for creating a product.
router.post("/product/create", async (request, response) => {
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


const upload = multer({
	limits: {
		fileSize: 500000
	},
	fileFilter(request, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Please upload an image"))
		}
		
		cb(undefined, true)
	}
})

// Http endpoint for uploading a product picture.
router.post("/product/image/:id", auth, upload.single("image"), async (request, response) => {
	const product = await Product.findOne({ _id: request.params.id })
	
	if (!product) {
		response.status(400).send()
	}
	
	const buffer = await sharp(request.file.buffer).resize({
		width: 150,
		height: 150}).png().toBuffer()
	
	product.image = buffer
	await product.save()
	response.send()
	
}, (error, request, response, next) => {
	response.status(400).send({ error: error.message })
})


// Http endpoint for viewing a product image.
router.get("/product/:id/image", async (request, response) => {
	try {
		const product = await Product.findById(request.params.id)
		
		if (!product || !product.image) {
			throw new Error()
		}
		
		response.set("Content-Type", "image/png")
		response.send(product.image)
	} catch (e) {
		response.status(404).send()
	} 
})

module.exports = router
