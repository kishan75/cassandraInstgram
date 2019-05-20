const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.getFollowers = function (req, res) {
  var result;
  if (req.params.time) {
    const query1 = "SELECT * FROM followers WHERE userid= ? and time < ? LIMIT 100";
    result = client.execute(query1, req.params, { prepare: true });
  }
  else {
    const query2 = "SELECT * FROM followers WHERE userid= ? LIMIT 100";
    result = client.execute(query2, req.params, { prepare: true });
  }
  result.then(result => res.send(result.rows), err => console.log(err));
};

collection.removeFollower = function (req, res) { };

module.exports = collection;