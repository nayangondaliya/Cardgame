const { authJwt } = require("../middleware");
const controller = require("../controllers/trade.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/trade/dashboard", [authJwt.verifyToken], controller.dashboard);

  app.post("/api/trade/send", [authJwt.verifyToken], controller.send);

  app.post("/api/trade/cancel", [authJwt.verifyToken], controller.cancel);

  app.post("/api/trade/accept", [authJwt.verifyToken], controller.accept);

  app.post("/api/trade/view", [authJwt.verifyToken], controller.view);
};