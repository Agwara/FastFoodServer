const mongoose = require("mongoose")

// Order Schema
const orderSchema = new mongoose.Schema({
    completed: {
        type: Boolean,
        default: false
    },

    products: [{
        productID: {
            type: mongoose.Schema.Types.ObjectId
        },
        productName: {
            type: String
        },
        productPrice: {
            type: Number
        },
        productQuantity: {
            type: Number
        },
        subTotalPrice: {
            type: Number
        }   
    }],

    totalPrice: {
        type: Number
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Customer"
    }
},
{
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)
module.exports = Order