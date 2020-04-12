const dbConfig = require('../config/db.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.HOST = dbConfig.HOST;
db.PORT = dbConfig.PORT;
db.DB = dbConfig.DB;

db.user = require("./user.model");
db.card = require("./card.model");

module.exports = db;