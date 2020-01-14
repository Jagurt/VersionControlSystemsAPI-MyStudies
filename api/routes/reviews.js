const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Review = require("../models/review");

//      Dokonczyc        //

router.post("/gameId", (req, res, next)=> {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    Review.findOne({ gameId: req.params.gameId, userId: decoded.userId})
    .exec()
    .then(review => {
        if(review) {
            res.status(409).json({message: "You already reviewed that game"});
        } else {
            if(err) {
                res.status(500).json({error: err});
            } else {
                const review = new Review({
                    _id: new mongoose.Types.ObjectId(),
                    userId: decoded.userId,
                    gameId: req.params.gameId,
                    description: String,
                    score: Number
                });
                review.save()
                .then(result=> {
                    res.status(201).json({message: "Your review has been saved"});
                                    })
                .catch(err => res.status(500).json({error: err}));
                
            }
        }
    })
    .catch(err => res.status(500).json({error: err}));
});

router.patch("/:gameId", (req, res, next)=> {
    const id = req.params.gameId;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    Review.update({gameId:id, userId: decoded.userId}, { $set: {
        description: req.body.description,
        score: req.body.score
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana info gry o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
});

router.delete("/:reviewId", (req, res, next)=> {
    const id = req.params.reviewId;
    Review.deleteOne({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie gry o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;