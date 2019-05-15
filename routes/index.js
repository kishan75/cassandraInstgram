var express = require('express');
var router = express.Router();
/* GET home page. */
router.use('/user', require("./users"));
router.use('/post', require("./post"));
router.use('/reply',require("./reply"));
//router.use('/comment', require("./comment"));
module.exports = router;
