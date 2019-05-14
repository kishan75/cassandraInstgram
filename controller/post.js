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
    const query = "INSERT INTO post (postid , userid , imagepath , time , caption) VALUES (?,?,?,?,?)";
    var result = client.execute(query, req.body, { prepare: true });
    result.then(result => {
        console.log(result);
        res.send(result);
    }, err => console.log(err));

};

module.exports = collection;
