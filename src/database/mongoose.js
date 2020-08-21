const mongoose = require("mongoose")

// ONLINE DATABASE
// mongoose.connect(process.env.MONGODB_URL, {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// });

// PRODUCTION DATABASE
mongoose.Promise = global.Promise;
mongoose.connect(process.env.PROD_MONGODB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
 });
