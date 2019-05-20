var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.get('/:userId', function (req, res) {
    controller.followers.getFollowers(req, res);
});

router.get('/:userId/:time', function (req, res) {
    controller.followers.getFollowers(req, res);
});

router.delete('/:userId/:time', function (req, res) {
    controller.followers.removeFollower(req, res);
});

module.exports = router;