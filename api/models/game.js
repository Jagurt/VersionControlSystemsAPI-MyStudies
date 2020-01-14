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
    score: Number,
    verified: Boolean
});

module.exports = mongoose.model("Game", productSchema);