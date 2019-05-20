var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.get('/:userId', function (req, res) {
    controller.followRequest.getFollowRequest(req, res);
});

router.get('/:userId/:response', function (req, res) {
    controller.followRequest.responseFollowRequst(req, res);
});

module.exports = router;