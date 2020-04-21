const mongoose = require('mongoose');

const FriendRequest = mongoose.model(
    "FriendRequest",
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

module.exports = FriendRequest;