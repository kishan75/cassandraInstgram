const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;
var user = require("./user");
var followRequest = require("./followRequest");
var collection = {};

collection.addFollowing = function (req, res) {
  user.isPrivate(req.body.targetuserid).then(result => {
    if (result.rows[0].isprivate != null) {
      followRequest.addFollowRequest(req, res);
    }
    else {
      req.body.time = new Date();
      req.body.id = TimeUuid.now();
      const query1 = "INSERT INTO following (userid , time , targetuserid) VALUES (?,?,?)";
      const query2 = "INSERT INTO followers (userid , time , followerid ) VALUES (?,?,?)";
      const query3 = "INSERT INTO myactivity (byuser,time,activityid,activitytype,ofuser) VALUES (?,?,?,?,?)";
      const query4 = "INSERT INTO notification (ofuser,time,byuser,notificationid,type) VALUES (?,?,?,?,?)";
      var queries = [
        {
          query: query1,
          params: req.body
        },
        {
          query: query2,
          params: [req.body.targetuserid, req.body.time, req.body.userid]
        },
        {
          query: query3,
          params: [req.body.userid, req.body.time, req.body.id, 3, req.body.targetuserid]
        },
        {
          query: query4,
          params: [req.body.targetuserid, req.body.time, req.body.userid, req.body.id, 3]
        }
      ];
      var result = client.batch(queries, { prepare: true });
      result.then(result => {
        const query5 = "UPDATE following_count SET following_count = following_count + 1 WHERE userid = ?";
        const query6 = "UPDATE followers_count SET followers_count = followers_count + 1 WHERE userid = ?";
        var queries = [
          {
            query: query5,
            params: [req.body.userid]
          },
          {
            query: query6,
            params: [req.body.targetuserid]
          }
        ];
        result = client.batch(queries, { prepare: true, logged: false });
        result.then(result => res.send("done"), err => console.log(err));
      }, err => console.log(err));
    }
  }, err => console.log(err));
};
collection.getFollowing = function (req, res) {
  const query1 = "SELECT * FROM followers WHERE userid= ?";
  result = client.execute(query1, req.params, { prepare: true });
  result.then(result => res.send(result.rows), err => console.log(err));
};

collection.removeFollowing = function (req, res) { };

module.exports = collection;