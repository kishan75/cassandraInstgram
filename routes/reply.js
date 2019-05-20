var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post("/", function (req, res) {
    controller.reply.createReply(req, res);
});

router.get("/:commentId", function (req, res) {
    controller.reply.getAllReplyByCommentId(req, res);
});

router.get("/:commentId/:time", function (req, res) {
    controller.reply.getAllReplyByCommentId(req, res);
});

module.exports = router;