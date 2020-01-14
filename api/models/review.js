const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userId: String,
    gameId: String,
    description: String,
    score: {
        type:Number,
        required: true,
        range: {
            min: 0,
            max: 10
        }
    }
});

module.exports = mongoose.model("Score", productSchema);