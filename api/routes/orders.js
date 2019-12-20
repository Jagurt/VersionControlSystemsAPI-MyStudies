const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");

//-------------- TODO dostosowac do zamowien --------------//

router.get("/", checkAuth, (req, res, next)=> {
    Product.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post("/", checkAuth, upload.single("productImage"),  (req, res, next)=> {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nowy produkt",
            createdProduct: product
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    Product.findById(id).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.patch("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    Product.update({_id:id}, { $set: {
        name: req.body.name,
        price: req.body.price
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana produktu o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.delete("/:productId", (req, res, next)=> {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie produktu o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;