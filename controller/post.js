const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createPost = function (req, res) {
    if (req.file == undefined) { 
        res.status(400).send("please select a image file");
        return;
    }
    req.body.postid = TimeUuid.now();
    req.body.imagepath = '/' + req.file.path;
    req.body.time = new Date();
    const query1 = "INSERT INTO post (postid , userid , imagepath , time , caption) VALUES (?,?,?,?,?)";
    const query2 = "UPDATE user SET post = post + {" + req.body.postid + " } where userid = ? ";
    const queries = [
        {
            query: query1,
            params: req.body
        },
        {
            query: query2,
            params: [req.body.userid]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        res.send("posted");
    }, err => {
        console.log(err);
    });
};

module.exports = collection;
