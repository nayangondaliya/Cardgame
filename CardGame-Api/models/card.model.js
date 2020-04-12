const mongoose = require('mongoose');

const Card = mongoose.model(
    "cards",
    new mongoose.Schema({
        artist: String,
        attack : Number,
        cardClass:String,
        health:Number,
        name:String,
        rarity:String
    })
);

module.exports = Card;