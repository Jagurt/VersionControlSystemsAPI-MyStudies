const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");

//-------------- TODO dostosowac do zamowien --------------//

router.get("/", checkAuth, (req, res, next)=> {
    Order.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post("/", checkAuth,  (req, res, next)=> {
    console.log(req.file);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productID: req.body.productID,
        date: Date(Date.now),
        email: decoded.email,
        country: req.body.country,
        city: req.body.city,
        adress: req.body.adress,
        zipCode: req.body.zipCode,
        phoneNum: req.body.phoneNum
    });
    order.save()
    .then(result => {
        res.status(200).json({
            message: "Dodano nowe zamowienie",
            createdOrder: order
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get("/:orderId", (req, res, next)=> {
    const id = req.params.orderId;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    order = Order.findById(id);

    order.exec(function (err, ordervalue) {
        if (err) return handleError(err);
        if (ordervalue.email != decoded.email)
        {
            const error = new Error("Nie jesteś upoważniony do przeglądania tych informacji!");
            error.status = 401;
            next(error);
            return;
        }
        else res.status(200).json(ordervalue);
      });
});

router.patch("/:orderId", (req, res, next)=> {
    const id = req.params.orderId;
    Order.update({_id:id}, { $set: {
        country: req.body.country,
        city: req.body.city,
        adress: req.body.adress,
        zipCode: req.body.zipCode,
        phoneNum: req.body.phoneNum
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana zamowienia o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.delete("/:orderId", (req, res, next)=> {
    const id = req.params.orderId;
    Order.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie zamowienia o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;