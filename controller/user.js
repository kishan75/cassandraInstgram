const client = require("../config/connectionToCassandra");
var dateFormat = require('dateformat');
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.registerUser = function (req, res) {
  req.body.time = new Date();
  req.body.dob = dateFormat(req.body.dob, 'yyyy-mm-dd');
  req.body.userid = TimeUuid.now();
  var query = "INSERT into user ( userid,dob,email,firstname,lastname,phone,time,username) VALUES( ?,?,?,?,?,?,?,?)";
  var result = client.execute(query, req.body, { prepare: true });
  result.then(result => res.send(result), err => console.log(err));
};

collection.isPrivate = function (userId) {
  const query = "SELECT isprivate FROM user WHERE userid = ?";
  return client.execute(query, [userId], { prepare: true });
};

module.exports = collection;
