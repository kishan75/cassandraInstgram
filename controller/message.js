const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.generateMessage = function (req, res) {
  req.body.messageid = TimeUuid.now();
  req.body.byuser = req.body.userid;
  req.body.time = new Date();
  const query1 = "INSERT INTO message (messageid,byuser,body,time,touser,type) VALUES (?,?,?,?,?,'send')";
  const query2 = "INSERT INTO message (messageid,byuser,body,time,touser,type) VALUES (?,?,?,?,?,'reply')";
  var queries = [
    {
      query: query1,
      params: req.bodyii
    },
    {
      query: query2,
      params: [req.body.messageid, req.body.touser, req.body.body, req.body.time, req.body.byuser]
    }
  ];
  var result = client.batch(queries, { prepare: true });
  result.then(result => {
    res.send("done");
  }, err => console.log(err));
};

collection.getAllMessage = function (req, res) {
  var result;
  if (req.params.time) {
    const query2 = "SELECT * FROM message WHERE byuser = ? AND touser = ? AND time > ? LIMIT 10";
    result = client.execute(query2, req.params, { prepare: true });
  }
  else {
    const query1 = "SELECT * FROM message WHERE byuser = ? AND touser = ? LIMIT 10";
    result = client.execute(query1, req.params, { prepare: true });
  }
  result.then(result => {
    res.send(result.rows);
  }, err => console.log(err));

};

module.exports = collection;

