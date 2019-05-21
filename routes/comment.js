var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
  controller.comment.createComment(req, res);
});

router.get('/:postId', function (req, res) {
  controller.comment.getAllCommentByPostId(req, res);
});

router.get('/:postId/:time', function (req, res) {
  controller.comment.getAllCommentByPostId(req, res);
});

module.exports = router;