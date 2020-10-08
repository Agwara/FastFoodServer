const mongoose = require("mongoose")

// Local Database URL
//const localURL = process.env.MONGODB_URL

// Online Database URL
const onlineURL = process.env.PROD_MONGODB_URL

mongoose.Promise = global.Promise

mongoose.connect(onlineURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
