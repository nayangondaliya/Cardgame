const db = require('../models');
const User = db.user;
const UserCard = db.usercard;

checkDuplicateUsername = (req, res, next) => {
    //UserName
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(200).send({ message: err || "System error", code: 'S01' });
            return;
        }

        if (user) {
            res.status(200).send({ message: "Username is already in use!", code: '999' });
            return;
        }

        next();
    });
};

const verifySignUp = {
    checkDuplicateUsername
};

module.exports = verifySignUp;
