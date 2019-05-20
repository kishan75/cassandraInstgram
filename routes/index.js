var express = require('express');
var router = express.Router();
/* GET home page. */
router.use('/user', require("./users"));
router.use('/post', require("./post"));
router.use('/comment', require("./comment"));
router.use('/reply', require("./reply"));
router.use('/message',require("./message"));
router.use('/followers',require("./followers"));
router.use('/following',require("./following"));
router.use('/followrequest',require("./followRequest"));
module.exports = router;
