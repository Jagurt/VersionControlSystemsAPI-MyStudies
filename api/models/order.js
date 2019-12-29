const mongoose = require("mongoose");

//-------------- TODO dostosowac do zamowien --------------//

const productSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productID: mongoose.Types.ObjectId,
    date: date,
    country: String,
    city: String,
    adress: String,
    zipCode: String,
    phoneNum: String
});

module.exports = mongoose.model("Order", productSchema);