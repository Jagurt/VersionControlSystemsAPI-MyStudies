const mongoose = require("mongoose");

//-------------- TODO dostosowac do zamowien --------------//

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    price: Number,
    productImage: String
});

module.exports = mongoose.model("Order", productSchema);