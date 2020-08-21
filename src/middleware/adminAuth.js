const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")

const auth = async (request, response, next) => {
	try {
		const token = request.header("Authorization").replace("Bearer ", "")
		const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET)
		const admin = await Admin.findOne({ _id: decoded._id, "tokens.token": token })
		
		
		if (!admin) {
			throw new Error() 
		}
		
		request.token = token
		request.admin = admin
		next()
		
	} catch(e) {
		response.status(401).send({error: "Please Authenticate"})
	}
}

module.exports = auth
