const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,"./uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(":", "_").replace(":", "_") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits:{ 
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

const Game = require("../models/game");

router.get("/", checkAuth, (req, res, next)=> {
    Product.find().exec()
    .then(docs=> {
        res.status(200).json(docs);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post("/", checkAuth, upload.single("productImage"),  (req, res, next)=> {

    const game = new Game({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        platforms: req.body.platforms,
        tags: req.body.tags,
        description: req.body.description,
        verified: false
    });

    game.save()
    .then(result => {
        res.status(200).json({
            message: "New game added.",
            registeredGame: game
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get("/:gameId", (req, res, next)=> {
    const id = req.params.gameId;
    Game.findById(id).exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => res.status(500).json({error: err}));

    
});

router.patch("/:gameId", (req, res, next)=> {
    const id = req.params.gameId;
    Game.update({_id:id}, { $set: {
        platforms: req.body.platforms,
        tags: req.body.tags,
        description: req.body.description
    }}).exec()
    .then(result=> {
        res.status(200).json({message: "Zmiana info gry o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
});

router.delete("/:gameId", (req, res, next)=> {
    const id = req.params.gameId;
    Game.deleteOne({_id: id}).exec()
    .then(result=> {
        res.status(200).json({message: "Usunięcie gry o numerze " + id});
    })
    .catch(err => res.status(500).json({error: err}));
    
});

module.exports = router;