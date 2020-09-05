const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    image: {
        type: Buffer
    }
}, {
    timestamps: true
});

const Image = mongoose.model("Image", imageSchema)
module.exports = Image