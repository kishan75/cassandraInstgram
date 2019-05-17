var express = require('express');
var router = express.Router();
var controller = require("../controller/index");

router.post('/', function (req, res) {
    controller.message.generateMessage(req, res);
});

router.get('/:byuser/:touser/:time', function (req, res) {
    controller.message.getAllMessage(req, res);
});

router.get('/:byuser/:touser', function (req, res) {
    controller.message.getAllMessage(req, res);
});

module.exports = router;