const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Card = db.card;

var jwt = require("jsonwebtoken");  
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    Card.aggregate([{ $sample: { size: 10 } }])
        .exec((err, data) => {
            if (err) {
                res.status(200).send({ message: "System Error", code: "E01" });
                return;
            }

            let userCard = new User({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password, 8)
            });

            data.forEach(element => {
                userCard.card.push(element._id);
            });

            userCard.save((err, userCard) => {
                if (err) {
                    res.status(200).send({ message: err || "System Error", code: "E01" });
                    return;
                }
            });

            return res.status(200).send({ message: "User registered successfully!", code: "000" });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .exec((err, user) => {
            if (err) {
                res.status(200).send({
                    id: 0,
                    username: "",
                    accessToken: null,
                    message: err || "System Error",
                    code: "E01",
                    cards: []
                });
                return;
            }

            if (!user) {
                return res.status(200).send({
                    id: 0,
                    username: "",
                    accessToken: null,
                    message: "User Not found.",
                    code: "U01",
                    cards: []
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(200).send({
                    id: 0,
                    username: "",
                    accessToken: null,
                    message: "Password is wrong!",
                    code: "U02",
                    cards: []
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                accessToken: token,
                code: "000",
                message: "Success",
            });
        });
};