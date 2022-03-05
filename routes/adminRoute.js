var express = require("express");
var router = express.Router();
const multer = require("multer");
const userAuth = require("./../api/v1/controllers/userAuth");

const {
  authValidation,
  nonAuthValidation,
} = require("./../api/utils/headersValidator");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  "/uplaodImage",
  authValidation,
  upload.single("image"),
  userAuth.uploadImage
);

module.exports = router;
