var express = require("express");
var router = express.Router();
const multer = require("multer");
const userAuth = require("./../api/v1/controllers/userAuth");

const {
  authValidation,
  nonAuthValidation,
} = require("./../api/utils/headersValidator");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", nonAuthValidation, userAuth.signup);
router.post("/signin", nonAuthValidation, userAuth.signin);
router.get("/getHome", authValidation, userAuth.getHome);
router.post("/logOut", userAuth.logOut);

module.exports = router;
