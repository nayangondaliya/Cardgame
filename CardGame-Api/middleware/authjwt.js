const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(200).send({ message: "Unauthorized request, Please login", code: "U01" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(200).send({ message: "Unauthorized request, Please login again", code: "U01" });
        }

        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken
};

module.exports = authJwt;