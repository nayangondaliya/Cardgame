const mongoose = require('mongoose');

const TradeRequest = mongoose.model(
    "TradeRequest",
    new mongoose.Schema({
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        senderCards:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"cards"
        }],
        receiverCards:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"cards"
        }]
    })
);

module.exports = TradeRequest;