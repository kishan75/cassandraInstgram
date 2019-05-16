var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
    controller.comment.createComment(req, res);
});

router.get('/:postId', function (req, res) {
    controller.comment.getAllCommentByPostId(req, res);
});
router.get('/like', function (req, res) {
    controller.comment.addLike(req, res);
});
router.get('/unlike', function (req, res) {
    controller.comment.deleteLike(req, res);
});

module.exports = router;