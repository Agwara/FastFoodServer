const jwt = require("jsonwebtoken")
const Customer = require("../models/customer")

const auth = async (request, response, next) => {
	try {
		const token = request.header("Authorization").replace("Bearer ", "")
		const decoded = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET)
		const customer = await Customer.findOne({ _id: decoded._id, "tokens.token": token })
		
		
		if (!customer) {
			throw new Error() 
		}
		
		request.token = token
		request.customer = customer
		next()
		
	} catch(e) {
		response.status(401).send({error: "Please Authenticate"})
	}
}

module.exports = auth
