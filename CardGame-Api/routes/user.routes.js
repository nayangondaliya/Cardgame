const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/home", [authJwt.verifyToken], controller.dashBoard);

  app.post("/api/user/addfriend", [authJwt.verifyToken], controller.addfriend);

  app.post("/api/user/searchuser", [authJwt.verifyToken], controller.searchuser);

  app.post("/api/user/acceptrequest", [authJwt.verifyToken], controller.acceptrequest);

  app.post("/api/user/cancelrequest", [authJwt.verifyToken], controller.cancelrequest);

  app.post("/api/user/getrequests", [authJwt.verifyToken], controller.getrequests);

  app.post("/api/user/cancelpendingrequest", [authJwt.verifyToken], controller.cancelPendingrequest);
};