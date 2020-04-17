const config = require("../config/auth.config");
const db = require("../models");
const mongoose = require('mongoose');
const User = db.user;
const FriendRequest = db.friendrequest;
const Friend = db.friend;

exports.dashBoard = (req, res) => {
    const userId = req.body.id;
    let cardsInfo = [];
    let friendsInfo = [];

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
                'cards.name': 1,
                'cards.artist': 1,
                'cards.attack': 1,
                'cards.class': 1,
                'cards.health': 1,
                'cards.rarity': 1
            }
        }
    ]).exec((err, data) => {
        if (err) {
            res.status(200).send({ message: "System Error", code: "E01", cards: [], friends: [] });
            return;
        }

        if (data != undefined && data.length > 0) {
            data[0].cards.forEach(element => {
                cardsInfo.push({
                    'id': element._id,
                    'name': element.name,
                    'artist': element.artist,
                    'attack': element.attack,
                    'class': element.cardClass,
                    'health': element.health,
                    'rarity': element.rarity
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
        ]).exec((err, data) => {
            if (err) {
                res.status(200).send({ message: "System Error", code: "E01", cards: [], friends: [] });
                return;
            }

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
                    if (err) {
                        res.status(200).send({ message: "System Error", code: "E01", cards: [], friends: [] });
                        return;
                    }

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

                    res.status(200).send({
                        message: "Success",
                        code: "000",
                        cards: cardsInfo,
                        friends: friendsInfo
                    });
                });
        });
    });
};

exports.addfriend = (req, res) => {
    const userId = req.body.id;
    const friendId = req.body.friendId;

    if (userId == friendId)
        return res.status(200).send({ message: "Can't send request to self", code: "U03" });

    FriendRequest.find({ "userId": userId })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01" });
            else {
                if (data == undefined || data.length == 0) {
                    let friendrequest = new FriendRequest({
                        userId: userId,
                    });

                    friendrequest.people.push(friendId);
                    friendrequest.save((err, friendrequest) => {
                        if (err) {
                            return res.status(200).send({ message: err || "System Error", code: "E01" });
                        }
                        else
                            return res.status(200).send({ message: "Request sent successfully", code: "R01" });
                    });
                }
                else
                    FriendRequest.findOneAndUpdate({ 'userId': userId },
                        { $push: { people: friendId } },
                        { new: true, useFindAndModify: false })
                        .exec((err, data) => {
                            if (err)
                                return res.status(200).send({ message: err || "System Error", code: "E01" });
                            else
                                return res.status(200).send({ message: "Request sent successfully", code: "R01" });
                        });
            }
        });
};

exports.searchuser = (req, res) => {
    const userName = req.body.username;
    const userId = req.body.id;

    if (userName == '' || userName == null || userName == undefined)
        return res.status(200).send({ message: "Invalid Request", code: "E03", user: null });

    User.find({ "username": new RegExp(userName, "i") })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01", users: [], friends: [] });
            else {
                let people = [];

                if (data != undefined && data.length > 0) {
                    data.forEach(element => {
                        people.push({ 'name': element.username, 'id': element._id });
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
                        $project: {
                            "_id": 0,
                            "friends._id": 1,
                            "friends.username": 1,
                        }
                    },
                    { $sort: { "friends.username": 1 } }
                ])
                    .exec((err, data) => {
                        let friends = [];

                        if (err)
                            return res.status(200).send({ message: "System Error", code: "E01", users: [], friends: [] });
                        else {
                            if (data != undefined && data.length > 0) {
                                data.forEach(element => {
                                    friends.push({ 'name': element.friends.username, 'id': element.friends._id });
                                });
                            }

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
                                    $project: {
                                        "_id": 0,
                                        "friends._id": 1,
                                        "friends.username": 1,
                                    }
                                },
                                { $sort: { "friends.username": 1 } }
                            ])
                                .exec((err, data) => {
                                    if (err)
                                        return res.status(200).send({ message: "System Error", code: "E01", users: [], friends: [] });
                                    else {
                                        if (data != undefined && data.length > 0) {
                                            data.forEach(element => {
                                                friends.push({ 'name': element.friends.username, 'id': element.friends._id });
                                            });
                                        }
                                    }

                                    return res.status(200).send({ message: "Success", code: "000", users: people, friends: friends });
                                });
                        }
                    });
            }
        });
};

exports.acceptrequest = (req, res) => {
    const userId = req.body.id;
    const friendId = req.body.friendId;

    FriendRequest.findOneAndUpdate({ "userId": mongoose.Types.ObjectId(friendId) },
        { $pull: { people: mongoose.Types.ObjectId(userId) } },
        { new: true, useFindAndModify: false })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01" });
            else {
                Friend.find({ "userId": userId })
                    .exec((ferr, fdata) => {
                        if (err)
                            return res.status(200).send({ message: "System Error", code: "E01" });
                        else {
                            if (fdata == undefined || fdata.length == 0) {
                                let friend = new Friend({
                                    userId: userId,
                                });

                                friend.people.push(friendId);
                                friend.save((errf, friend) => {
                                    if (errf) {
                                        return res.status(200).send({ message: "System Error", code: "E01" });
                                    }
                                    else {
                                        return res.status(200).send({ message: "Request accepted", code: "R03" });
                                    }
                                });
                            }
                            else {
                                Friend.findOneAndUpdate({ 'userId': userId },
                                    { $push: { people: friendId } },
                                    { new: true, useFindAndModify: false })
                                    .exec((frerr, frdata) => {
                                        if (frerr)
                                            return res.status(200).send({ message: err || "System Error", code: "E01" });
                                        else {
                                            return res.status(200).send({ message: "Request accepted", code: "R03" });
                                        }
                                    });
                            }
                        }
                    });
            }
        });
};

exports.cancelrequest = (req, res) => {
    const userId = req.body.id;
    const friendId = req.body.friendId;

    FriendRequest.findOneAndUpdate({ "userId": mongoose.Types.ObjectId(userId) },
        { $pull: { people: mongoose.Types.ObjectId(friendId) } },
        { new: true, useFindAndModify: false })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01" });
            else
                return res.status(200).send({ message: "Request cancelled", code: "R02" });
        });
};

exports.getrequests = (req, res) => {
    const userId = req.body.id;

    FriendRequest.aggregate([
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
            $project: {
                "_id": 0,
                "friends._id": 1,
                "friends.username": 1,
            }
        },
        {
            $group: {
                _id: "$friends._id",
                username: { $first: "$friends.username" },
            }
        },
        { $sort: { "friends.username": 1 } }
    ])
        .exec((serr, sdata) => {
            let sentRequests = [];
            let pendingRequests = [];

            if (serr)
                return res.status(200).send({ message: "System error", code: "E01", sentRequests: [], pendingRequests: [] });
            else {
                if (sdata != undefined || sdata.length > 0) {
                    sdata.forEach(element => {
                        if (element._id != null && element.username != null)
                            sentRequests.push({ id: element._id, name: element.username });
                    });
                }

                FriendRequest.aggregate([
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
                        $project: {
                            "_id": 0,
                            "friends._id": 1,
                            "friends.username": 1,
                        }
                    },
                    {
                        $group: {
                            _id: "$friends._id",
                            username: { $first: "$friends.username" },
                        }
                    },
                    { $sort: { "friends.username": 1 } }
                ])
                    .exec((perr, pdata) => {
                        if (perr)
                            return res.status(200).send({ message: "System error", code: "E01", sentRequests: [], pendingRequests: [] });
                        else {
                            if (pdata != undefined || pdata.length > 0) {
                                pdata.forEach(element => {
                                    if (element._id != null && element.username != null)
                                        pendingRequests.push({ id: element._id, name: element.username });
                                });
                            }
                        }

                        pendingRequests = pendingRequests.sort(function (a, b) {
                            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0
                        });

                        sentRequests = sentRequests.sort(function (a, b) {
                            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                            if (nameA < nameB) //sort string ascending
                                return -1
                            if (nameA > nameB)
                                return 1
                            return 0
                        });
                        return res.status(200).send({ message: "Success", code: "000", sentRequests: sentRequests, pendingRequests: pendingRequests });
                    });
            }
        });
};

exports.cancelPendingrequest = (req, res) => {
    const userId = req.body.id;
    const friendId = req.body.friendId;

    FriendRequest.findOneAndUpdate({ "userId": mongoose.Types.ObjectId(friendId) },
        { $pull: { people: mongoose.Types.ObjectId(userId) } },
        { new: true, useFindAndModify: false })
        .exec((err, data) => {
            if (err)
                return res.status(200).send({ message: "System Error", code: "E01" });
            else
                return res.status(200).send({ message: "Request cancelled", code: "R02" });
        });
};