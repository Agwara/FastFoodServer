const express = require("express")
const Order = require("../models/order")
const auth = require("../middleware/customerAuth")
// const cleanCache = require("../middleware/cleanCache")
const router = new express.Router()

// Http endpoint for creating an order
// We clean the cache when we create a new order.

// router.post("/order/create", auth, cleanCache, async (request, response) => {
//     const order = new Order({
//         ...request.body,
//         owner: request.customer._id
//     })

//     try {
//         await order.save()
//         response.status(201).send(order)
//     } catch (e) {
//         response.status(400).send(e)
//     }

// })

// Http endpoint for creating an order
router.post("/order/create", auth, async (request, response) => {
    const order = new Order({
        ...request.body,
        owner: request.customer._id
    });

    try {
        await order.save()
        response.status(201).send(order)
    } catch (e) {
        response.status(400).send(e)
    }
})

// Http endpoint for getting all orders
router.get("/admin/orders", async (request, response) => {
    try {
        const orders = await Order.find({})
        response.send(orders)
    } catch (e) {
        response.status(500).send()
    }
});

// Http endpoint for fetching a customer's list of orders
// Remember the request is being cached

// router.get("/orders/me", auth, async (request, response) => {
//     try {
//         const idString = JSON.stringify(request.customer._id)
//         const orders = await Order.find({ owner: request.customer._id }).cache({
//             key: idString
//          });

//         response.send(orders)
//     } catch (e) {
//         response.status(500).send()
//     }
// })

// Http endpoint for fetching a customer's list of orders
router.get("/orders/me", auth, async (request, response) => {
    try {
        const orders = await Order.find({ owner: request.customer._id });

        response.send(orders)
    } catch (e) {
        response.status(500).send()
    }
})


module.exports = router;