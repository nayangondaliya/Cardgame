const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.dashBoard = (req, res) => {
    const userId = req.id;

    User.aggregate([
        {
            $match: {
                "_id": { $ne: userId }
            }
        },
        {
            $lookup: {
                from: "cards",
                localField: "card",
                foreignField: "_id",
                as: "cardsData"
            }
        }
    ]).exec((err, data) => {
        if (err) {
            console.log(err);
            res.status(200).send({ message: "System Error", code: "E01" });
            return;
        }

        let cardsInfo = [];

        data[0].cardsData.forEach(element => {
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

        res.status(200).send({
            message: "Success",
            code: "000",
            cards: cardsInfo
        });
    });
};