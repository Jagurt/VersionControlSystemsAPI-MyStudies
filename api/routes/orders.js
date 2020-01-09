const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");

//-------------- TODO dostosowac do zamowien --------------//

router.get("/", checkAuth, (req, res, next)=> {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    Order.find({email:decoded.email}).exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post("/", checkAuth,  (req, res, next)=> {
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
            const error = new Error("You are not allowed to view this information!");
            error.status = 401;
            next(error);
            return;
        }
        else res.status(200).json(ordervalue);
      });
});

router.patch("/:orderId", (req, res, next)=> {
    const id = req.params.orderId;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    order = Order.findById(id);

    order.exec(function (err, ordervalue) {
        if (err) return handleError(err);
        if (ordervalue.email != decoded.email)
        {
            const error = new Error("You are not allowed to modify this order!");
            error.status = 401;
            next(error);
            return;
        }
        else 
        {
            const updateOrder = new Order;

            updateOrder.country = req.body.country;
            updateOrder.city = req.body.city;
            updateOrder.adress = req.body.adress;
            updateOrder.zipCode = req.body.zipCode;
            updateOrder.phoneNum = req.body.phoneNum;

            Order.update({ _id: id }, updateOrder, {multi: false }, function(err) {
                if(err) { throw err; }
                res.status(200).json({message: "Changing order with id " + id});
            });
        }
      });
});

router.delete("/:orderId", (req, res, next)=> {
    const id = req.params.orderId;

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    order = Order.findById(id);

    order.exec(function (err, ordervalue) {
        if (err) return handleError(err);
        if (ordervalue.email != decoded.email)
        {
            const error = new Error("You are not allowed to delete this!");
            error.status = 401;
            next(error);
            return;
        }
        else 
        {
            Order.remove({_id: id}, function(err) {
                if(err) { throw err; }
                res.status(200).json({message: "Deleting order with id " + id});
            });
        }
      });

    /*Order.remove({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie zamowienia o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));*/
    
});

module.exports = router;