const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const gameRoutes = require("./api/routes/games");
const userRoutes = require("./api/routes/users");
const reviewRoutes = require("./api/routes/reviews");

mongoose.connect("mongodb+srv://Jagurt:"+ process.env.MONGO_PASS + "@cluster0-7zpmh.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/games", gameRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);

app.use((req, res, next)=> {
    const error = new Error("Nie znaleziono");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=> {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

//koniec
