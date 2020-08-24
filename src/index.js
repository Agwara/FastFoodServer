const express = require("express")
const bodyParser = require("body-parser")
require("./database/mongoose")
const cors = require("cors")

const adminRouter = require("./routers/admin")
const customerRouter = require("./routers/customer")
const orderRouter = require("./routers/order")
const productRouter = require("./routers/product")

const app = express()

app.use(cors({credentials: true, origin: 'http://localhost:8080'}))
const port = process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())
app.use(customerRouter)
app.use(adminRouter)
app.use(productRouter)
app.use(orderRouter)

app.listen(port, () => {
	console.log("Server is up on port " + port)
})
