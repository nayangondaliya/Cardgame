const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');

const app = express();

//Cors configutaion
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to cards game application." });
});

//Db configuration
const db = require("./models");

db.mongoose
  .connect(`mongodb://${db. HOST}:${db.PORT}/${db.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    //initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/trade.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);
app.set('io', io);

server.listen(PORT);
