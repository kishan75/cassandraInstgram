var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
    controller.comment.createComment(req, res);
});

module.exports = router;