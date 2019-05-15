var express = require('express');
var router = express.Router();
/* GET home page. */
router.use('/user', require("./users"));
router.use('/post', require("./post"));
router.use('/comment', require("./comment"));
router.use('/reply', require("./reply"));
module.exports = router;
