const mongoose = require('mongoose');

const Friend = mongoose.model(
    "Friend",
    new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        people:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        }]
    })
);

module.exports = Friend;