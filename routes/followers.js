var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
    controller.followers.addFollower(req, res);
});

router.get('/:userId', function (req, res) {
    controller.followers.getFollowers(req, res);
});

router.get('/:userId/:time', function (req, res) {
    controller.followers.getFollowers(req, res);
});

module.exports = router;