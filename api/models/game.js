const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: String,
    productImage: String,
    platforms: String,
    releaseDate: String,
    tags: String,
    description: String,
    screens: String,
    score: {
        type: Number,
        default: 0
    },
    verified: Boolean,
    reviewers: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Game", productSchema);