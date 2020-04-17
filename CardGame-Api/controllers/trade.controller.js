const config = require("../config/auth.config");
const db = require("../models");
const mongoose = require('mongoose');
const TradeRequest = db.traderequest;
const User = db.user;
const Friend = db.friend;

exports.dashboard = (req, res) => {
    const userId = req.body.userId;

    TradeRequest.aggregate([
        { $match: { "receiverId": mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "pendingRequests"
            }
        },
        {
            $project: {
                "pendingRequests.username": 1
            }
        }
    ])
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System error", code: "E01", friends: [], cards: [], sentRequests: [], pendingRequests: [] });
            else {
                let pendingRequests = [];

                data.forEach(element => {
                    pendingRequests.push({ tradeId: element._id, name: element.pendingRequests[0].username });
                });

                TradeRequest.aggregate([
                    { $match: { "senderId": mongoose.Types.ObjectId(userId) } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiverId",
                            foreignField: "_id",
                            as: "sentRequests"
                        }
                    },
                    {
                        $project: {
                            "sentRequests.username": 1
                        }
                    }
                ])
                    .exec((err, data) => {
                        if (err)
                            return res.status(200).send({ message: "System error", code: "E01", friends: [], cards: [], sentRequests: [], pendingRequests: [] });
                        else {
                            let sentRequests = [];

                            data.forEach(element => {
                                sentRequests.push({ tradeId: element._id, name: element.sentRequests[0].username });
                            });

                            User.aggregate([
                                {
                                    $match: {
                                        _id: mongoose.Types.ObjectId(userId)
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "cards",
                                        localField: "card",
                                        foreignField: "_id",
                                        as: "cards"
                                    }
                                },
                                {
                                    $project: {
                                        'cards._id': 1,
                                        'cards.name': 1
                                    }
                                }
                            ])
                                .exec((err, data) => {
                                    if (err)
                                        return res.status(200).send({ message: "System error", code: "E01", friends: [], cards: [], sentRequests: [], pendingRequests: [] });
                                    else {
                                        let cardsInfo = [];

                                        if (data != undefined && data.length > 0) {
                                            data[0].cards.forEach(element => {
                                                cardsInfo.push({
                                                    'id': element._id,
                                                    'name': element.name
                                                });
                                            });
                                        }

                                        Friend.aggregate([
                                            { $match: { "userId": mongoose.Types.ObjectId(userId) } },
                                            {
                                                $lookup: {
                                                    from: "users",
                                                    localField: "people",
                                                    foreignField: "_id",
                                                    as: "friends"
                                                }
                                            },
                                            {
                                                $unwind: {
                                                    path: "$friends",
                                                    preserveNullAndEmptyArrays: true
                                                }
                                            },
                                            {
                                                $lookup: {
                                                    from: "cards",
                                                    localField: "friends.card",
                                                    foreignField: "_id",
                                                    as: "cards"
                                                }
                                            },
                                            {
                                                $unwind: {
                                                    path: "$cards",
                                                    preserveNullAndEmptyArrays: true
                                                }
                                            },
                                            {
                                                $project: {
                                                    "_id": 0,
                                                    "friends._id": 1,
                                                    "friends.username": 1,
                                                    "cards._id": 1,
                                                    "cards.name": 1
                                                }
                                            },
                                            {
                                                $group: {
                                                    _id: "$friends._id",
                                                    username: { $first: "$friends.username" },
                                                    cards: {
                                                        $push: "$cards"
                                                    }
                                                }
                                            },
                                            { $sort: { "friends.username": 1 } }
                                        ])
                                            .exec((err, data) => {
                                                if (err)
                                                    return res.status(200).send({ message: "System error", code: "E01", friends: [], cards: [], sentRequests: [], pendingRequests: [] });
                                                else {
                                                    let friendsInfo = [];

                                                    data.forEach(element => {
                                                        let friendsCard = [];

                                                        element.cards.forEach(card => {
                                                            friendsCard.push({
                                                                'id': card._id,
                                                                'name': card.name
                                                            });
                                                        });

                                                        friendsCard = friendsCard.sort(function (a, b) {
                                                            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                                                            if (nameA < nameB) //sort string ascending
                                                                return -1
                                                            if (nameA > nameB)
                                                                return 1
                                                            return 0
                                                        });
                                                        
                                                        friendsInfo.push({
                                                            'id': element._id,
                                                            'name': element.username,
                                                            'cards': friendsCard
                                                        });
                                                    });

                                                    Friend.aggregate([
                                                        { $match: { "people": { $in: [mongoose.Types.ObjectId(userId)] } } },
                                                        {
                                                            $lookup: {
                                                                from: "users",
                                                                localField: "userId",
                                                                foreignField: "_id",
                                                                as: "friends"
                                                            }
                                                        },
                                                        {
                                                            $unwind: {
                                                                path: "$friends",
                                                                preserveNullAndEmptyArrays: true
                                                            }
                                                        },
                                                        {
                                                            $lookup: {
                                                                from: "cards",
                                                                localField: "friends.card",
                                                                foreignField: "_id",
                                                                as: "cards"
                                                            }
                                                        },
                                                        {
                                                            $unwind: {
                                                                path: "$cards",
                                                                preserveNullAndEmptyArrays: true
                                                            }
                                                        },
                                                        {
                                                            $project: {
                                                                "_id": 0,
                                                                "friends._id": 1,
                                                                "friends.username": 1,
                                                                "cards._id": 1,
                                                                "cards.name": 1
                                                            }
                                                        },
                                                        {
                                                            $group: {
                                                                _id: "$friends._id",
                                                                username: { $first: "$friends.username" },
                                                                cards: {
                                                                    $push: "$cards"
                                                                }
                                                            }
                                                        },
                                                        { $sort: { "friends.username": 1 } }
                                                    ])
                                                        .exec((err, data) => {
                                                            if (err)
                                                                return res.status(200).send({ message: "System error", code: "E01", friends: [], cards: [], sentRequests: [], pendingRequests: [] });
                                                            else {
                                                                data.forEach(element => {
                                                                    let friendsCard = [];

                                                                    element.cards.forEach(card => {
                                                                        friendsCard.push({
                                                                            'id': card._id,
                                                                            'name': card.name
                                                                        });
                                                                    });

                                                                    friendsCard = friendsCard.sort(function (a, b) {
                                                                        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                                                                        if (nameA < nameB) //sort string ascending
                                                                            return -1
                                                                        if (nameA > nameB)
                                                                            return 1
                                                                        return 0
                                                                    });

                                                                    friendsInfo.push({
                                                                        'id': element._id,
                                                                        'name': element.username,
                                                                        'cards': friendsCard
                                                                    });
                                                                });

                                                                friendsInfo = friendsInfo.sort(function (a, b) {
                                                                    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                                                                    if (nameA < nameB) //sort string ascending
                                                                        return -1
                                                                    if (nameA > nameB)
                                                                        return 1
                                                                    return 0
                                                                });
                                            
                                                                cardsInfo = cardsInfo.sort(function (a, b) {
                                                                    var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                                                                    if (nameA < nameB) //sort string ascending
                                                                        return -1
                                                                    if (nameA > nameB)
                                                                        return 1
                                                                    return 0
                                                                });

                                                                return res.status(200).send({
                                                                    message: "Success",
                                                                    code: "000",
                                                                    friends: friendsInfo,
                                                                    cards: cardsInfo,
                                                                    sentRequests: sentRequests,
                                                                    pendingRequests: pendingRequests
                                                                });
                                                            }
                                                        });

                                                }
                                            });
                                    }
                                });
                        }
                    });
            }
        });
};

exports.cancel = (req, res) => {
    const tradeId = req.body.tradeId;

    TradeRequest.findById({ _id: mongoose.Types.ObjectId(tradeId) })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01" });
            else {
                let senderCards = [];

                data.senderCards.forEach(element => {
                    senderCards.push(mongoose.Types.ObjectId(element));
                });

                User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(data.senderId) },
                    { $push: { card: { $each: senderCards } } },
                    { new: true, useFindAndModify: false })
                    .exec((err, data) => {
                        if (err)
                            return res.status(200).send({ message: "System Error", code: "E01" });
                        else {
                            TradeRequest.deleteOne({ _id: mongoose.Types.ObjectId(tradeId) })
                                .exec((err, data) => {
                                    if (err)
                                        return res.status(200).send({ message: "System Error", code: "E01" });
                                    else
                                        return res.status(200).send({ message: "Success", code: "000" });
                                });
                        }
                    });
            }
        });
};

exports.send = (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const senderCards = req.body.senderCards;
    const receiverCards = req.body.receiverCards;

    const traderequest = new TradeRequest({
        senderId: senderId,
        receiverId: receiverId,
        senderCards: senderCards,
        receiverCards: receiverCards
    });

    traderequest.save((err, traderequest) => {
        if (err)
            return res.status(200).send({ message: "System Error", code: "E01" });
        else {
            User.findByIdAndUpdate({ _id: traderequest.senderId },
                { $pull: { card: { $in: traderequest.senderCards } } },
                { new: true, useFindAndModify: false })
                .exec((err, data) => {
                    if (err)
                        return res.status(200).send({ message: "System Error", code: "E01" });
                    else
                        return res.status(200).send({ message: "success", code: "000" }); x
                });
        }
    });
};

exports.accept = (req, res) => {
    const tradeId = req.body.tradeId;

    TradeRequest.findById({ _id: mongoose.Types.ObjectId(tradeId) })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System error", code: "E01" });
            else {
                const senderId = data.senderId;
                const receiverId = data.receiverId;
                let senderCards = [];
                let receiverCards = [];

                data.senderCards.forEach(element => {
                    senderCards.push(mongoose.Types.ObjectId(element));
                });

                data.receiverCards.forEach(element => {
                    receiverCards.push(mongoose.Types.ObjectId(element));
                });

                User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(receiverId) },
                    { $pull: { card: { $in: receiverCards } } },
                    { new: true, useFindAndModify: false })
                    .exec((err, data) => {
                        if (err)
                            return res.status(200).send({ message: "System error", code: "E01" });
                        else {
                            User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(senderId) },
                                { $push: { card: { $each: receiverCards } } },
                                { new: true, useFindAndModify: false })
                                .exec((err, data) => {
                                    if (err)
                                        return res.status(200).send({ message: "System error" + err, code: "E01" });
                                    else {
                                        User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(receiverId) },
                                            { $push: { card: { $each: senderCards } } },
                                            { new: true, useFindAndModify: false })
                                            .exec((err, data) => {
                                                if (err)
                                                    return res.status(200).send({ message: "System error", code: "E01" });
                                                else {
                                                    TradeRequest.deleteOne({ _id: mongoose.Types.ObjectId(tradeId) })
                                                        .exec((err, data) => {
                                                            if (err)
                                                                return res.status(200).send({ message: "System error", code: "E01" });
                                                            else
                                                                return res.status(200).send({ message: "Success", code: "000" });
                                                        });
                                                }
                                            });
                                    }
                                });
                        }
                    });
            }
        });
};

exports.view = (req, res) => {
    var tradeId = req.body.tradeId;

    TradeRequest.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(tradeId) } },
        {
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $unwind: {
                path: "$sender",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "cards",
                localField: "senderCards",
                foreignField: "_id",
                as: "senderCards"
            }
        },
        {
            $unwind: {
                path: "$senderCards",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                "sender._id": 1,
                "sender.username": 1,
                "senderCards.name": 1
            }
        },
        {
            $group: {
                _id: "$sender._id",
                name: { $first: "$sender.username" },
                cards: {
                    $push: "$senderCards"
                }
            }
        }
    ]).
        exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System error", code: "E01", sender: {}, receiver: {} });
            else {
                let sender = { name: '', id: '', cards: [] };

                sender.name = data[0].name;
                sender.id = data[0]._id;

                data[0].cards.forEach(element => {
                    sender.cards.push({'name' : element.name});
                });

                TradeRequest.aggregate([
                    { $match: { _id: mongoose.Types.ObjectId(tradeId) } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "receiverId",
                            foreignField: "_id",
                            as: "receiver"
                        }
                    },
                    {
                        $unwind: {
                            path: "$receiver",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "cards",
                            localField: "receiverCards",
                            foreignField: "_id",
                            as: "receiverCards"
                        }
                    },
                    {
                        $unwind: {
                            path: "$receiverCards",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            "receiver._id": 1,
                            "receiver.username": 1,
                            "receiverCards.name": 1
                        }
                    },
                    {
                        $group: {
                            _id: "$receiver._id",
                            name: { $first: "$receiver.username" },
                            cards: {
                                $push: "$receiverCards"
                            }
                        }
                    }
                ])
                    .exec((err, data) => {
                        if (err)
                            return res.status(200).send({ message: "System error", code: "E01", sender: {}, receiver: {} });
                        else {
                            let receiver = { name: '', id: '', cards: [] };

                            receiver.name = data[0].name;
                            receiver.id = data[0]._id;

                            data[0].cards.forEach(element => {
                                receiver.cards.push({'name' : element.name});
                            });

                            return res.status(200).send({ message: "Success", code: "000", sender: sender, receiver: receiver });
                        }
                    });
            }
        });
};