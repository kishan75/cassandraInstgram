var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/like', function (req, res) {
  controller.reply.addLike(req, res);
});

module.exports = router;
