const mongoose = require("mongoose");

//-------------- TODO dostosowac do zamowien --------------//

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productID: String,
    date: Date,
    email: String,
    country: String,
    city: String,
    adress: String,
    zipCode: String,
    phoneNum: String
});

module.exports = mongoose.model("Order", productSchema);