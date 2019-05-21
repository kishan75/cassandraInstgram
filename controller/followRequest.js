const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.addFollowRequest = function (req, res) {
  req.body.time = new Date();
  req.body.id = TimeUuid.now();
  const query1 = "INSERT INTO followrequest (userid , time , requestuserid ) VALUES ( ?,?,?)";
  const query2 = "INSERT INTO notification (ofuser,time,byuser,notificationid,type) VALUES (?,?,?,?,?)";
  var queries = [
    {
      query: query1,
      params: [req.body.targetuserid, req.body.time, req.body.userid]
    },
    {
      query: query2,
      params: [req.body.targetuserid, req.body.time, req.body.userid, req.body.id, 5]
    }
  ];
  var result = client.batch(queries, { prepare: true });
  result.then(result => res.send("done"), err => console.log(err));
};

collection.getFollowRequest = function (req, res) {
  const query = " SELECT * FROM followrequest WHERE userid = ?";
  var result = client.execute(query, req.params, { prepare: true });
  result.then(result => res.send(result.rows), err => console.log(err));
};

collection.responseFollowRequst = function (req, res) {
  if (req.params.response) {

  }
  else {
    const query = "DELETE from followrequest WHERE userid = ? AND time =?";
    var result = client.execute(query, [req.params.userId, req.params.requestUserTime], { prepare: true });
    result.then(result => res.send(result), err => console.log(err));
  }
};

module.exports = collection;