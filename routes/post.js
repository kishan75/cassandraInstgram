var express = require('express');
var router = express.Router();
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname);
  }
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/'))
      cb(null, true);
    else
      cb(null, false);
  }
});

var controller = require("../controller/index");

router.post("/", upload.single("imagepath"), function (req, res) {
  controller.post.createPost(req, res);
});
router.get('/', function (req, res) {
  res.render("index.ejs", {});
});

module.exports = router;
