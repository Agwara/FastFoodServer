const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const Image = require("../models/image")
const auth = require("../middleware/adminAuth")
const router = new express.Router()

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
router.post("/image/upload", auth, upload.single("image"), async (request, response) => {
	try {
		const image = new Image(request.body)
		const buffer = await sharp(request.file.buffer).resize({
			width: 150,
			height: 150}).png().toBuffer()
		
		image.image = buffer
		await image.save()
		response.set("Content-Type", "image/png")
		response.send(image.image)
	} catch (e) {
		response.status(500).send(e)
	}
	
}, (error, request, response, next) => {
	response.status(400).send({ error: error.message })
})

// Httpe endpoint for viewing an image.
router.get("/image/:id", async (request, response) => {
	try {
		const image = await Image.findById(request.params.id)

		if (!image) {
			throw new Error()
		}
		response.set("Content-Type", "image/png")
		response.send(image.image)
	} catch (e) {
		response.status(404).send(e)
	}
})

module.exports = router