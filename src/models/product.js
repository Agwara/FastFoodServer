const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		trim: true,
		required: "Name is required"
	},
	
	imageName: {
		type: mongoose.Schema.Types.String,
		ref: "Image",
		default: "defaultImage"
	},
	
	category: {
		type: String
	},
	
	quantity: {
		type: Number
	},
	
	price: {
		type: Number,
		required: "Price is required"
	},
	
	availability: {
		type: Boolean,
		default: true
	},
	
	serveWith: {
		type: String
	}
}, {
	timestamps: true
})

productSchema.methods.toJSON = function () {
	const product = this
	const productObject = product.toObject()
	
	delete productObject.image
	
	return productObject
}

const Product = mongoose.model("Product", productSchema)

module.exports = Product