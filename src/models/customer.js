const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const customerSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	
	lastName: {
		type: String,
		required: true,
		trim: true
	},

	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid")
			}
		}
	},
	
	phone: {
		type: String,
		required: true,
		validate(value) {
			if (!(/\d{9}/.test(value))) {
				throw new Error("Phone number is invalid")
			}
		}
		
	},

	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value) {
			if (value.includes("password")) {
				throw new Error('Password cannot contain "password"')
			}
		}
	},
	
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
	
}, {
	timestamps: true
})

customerSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'owner'
})

customerSchema.methods.toJSON = function () {
	const customer = this
	const customerObject = customer.toObject()
	
	delete customerObject.password
//	delete customerObject.tokens
	
	return customerObject
}

// Generate authentication token 
customerSchema.methods.generateAuthToken = async function () {
	const customer = this
	const token = jwt.sign({ _id: customer._id.toString() }, process.env.CUSTOMER_JWT_SECRET)
	
	customer.tokens = customer.tokens.concat({ token })
	await customer.save()
	
	return token
}


customerSchema.statics.findByCredentials = async (email, password) => {
	const customer = await Customer.findOne({ email })
	
	if (!email) {
		throw new Error("Unable to login")
	}
	
	const isMatch = await bcrypt.compare(password, customer.password)
	
	if (!isMatch) {
		throw new Error("Unable to login")
	}
	
	return customer
}

// Hash the plain text password before saving
customerSchema.pre("save", async function (next) {
	const customer = this
	
	if (customer.isModified("password")) {
		customer.password = await bcrypt.hash(customer.password, 8)
	}
	
	next()
})


const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer
