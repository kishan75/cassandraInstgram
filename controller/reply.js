const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createReply = function (req, res) {
    req.body.replyid = TimeUuid.now();
    req.body.time = new Date();
    const query1 = "INSERT INTO reply (replyid,reply,commentid,time,userid) VALUES (?,?,?,?,?)";
    const query2 = "INSERT INTO myactivity (activityid , activityobjectid , activitytype , byuser , ofuser , time ) VALUES (?,?,?,?,?,?)";
    const query3 = "INSERT INTO notification (notificationid,byuser,ofuser,type,notificationobjectid,time) VALUES (?,?,?,?,?,?)";
    var quries = [
        {
            query: query1,
            params: req.body
        },
        {
            query: query2,
            params: [req.body.replyid, req.body.commentid, 4, req.body.userid, req.body.ofuserid, req.body.time]
        },
        {
            query: query3,
            params: [req.body.replyid, req.body.userid, req.body.ofuserid, 4, req.body.commentid, req.body.time]
        }
    ];

    var result = client.batch(quries, { prepare: true });
    result.then(result => {
        const query4 = "UPDATE reply_count SET reply_count = reply_count + 1 where commentid = ?";
        result = client.execute(query4, req.body, { prepare: true });
        result.then(reult => res.send("done"), err => console.log(err));
    }, err => res.send(err));

};

collection.getAllReplyByCommentId = function (req, res) {
    var result;
    if (req.params.time) {
        const query1 = "SELECT * FROM reply WHERE commentid=? AND time < ? LIMIT 10";
        result = client.execute(query1, req.params, { prepare: true });
    }
    else {
        const query2 = "SELECT * FROM reply WHERE commentid=? LIMIT 10";
        result = client.execute(query2, req.params, { prepare: true });
    }
    result.then(result => res.send(result.rows), err => console.log(err));
};

module.exports = collection;