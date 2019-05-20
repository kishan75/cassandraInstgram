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
  var result = client.execute(query1, req.body, { prepare: true });
  result.then(result => {
    const query2 = "UPDATE post_count SET post_count = post_count + 1 where userid = ? ";
    var result = client.execute(query2, [req.body.userid], { prepare: true });
    result.then(result => res.send("done"), err => console.log(err));
  }, err => console.log(err));
};

collection.getAllPostByUserId = function (req, res) {
  var result;
  if (req.params.time) {
    const query1 = "SELECT * FROM post WHERE userid = ? and time < ? LIMIT 10";
    result = client.execute(query1, [req.params.userId, req.params.time], { prepare: true });
  }
  else {
    const query2 = "SELECT * FROM post WHERE userid = ? LIMIT 10";
    result = client.execute(query2, [req.params.userId], { prepare: true });
  }
  result.then(result => res.send(result.rows), err => console.log(err));
};

module.exports = collection;
