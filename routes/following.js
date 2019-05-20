var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
    controller.following.addFollowing(req, res);
});

router.get('/:userId', function (req, res) {
    controller.following.getFollowing(req, res);
});

router.get('/:userId/:time', function (req, res) {
    controller.following.getFollowing(req, res);
});

module.exports = router;