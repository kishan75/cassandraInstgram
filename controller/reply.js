const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createReply = function (req, res) {
    req.body.replyid = TimeUuid.now();
    req.body.time = new Date();
    const query1 = "INSERT INTO reply (replyid,reply,postid,commentid,time,userid) VALUES (?,?,?,?,?,?)";
    const query2 = "UPDATE comment SET replies = replies + {" + req.body.replyid + "} WHERE commentid=?";
    const query3 = "INSERT INTO myactivity (activityid , activityobjectid , activitytype , byuser , ofuser , time ) VALUES (?,?,?,?,?,?)";
    const query4 = "INSERT INTO notification (notificationid,fromuser,touser,type,notificationobjectid,time) VALUES (?,?,?,?,?,?)";
    const query5 = "UPDATE user SET myactivity = myactivity + {" + req.body.replyid + "} WHERE userid=?";
    const query6 = "UPDATE user SET notifications = notifications + {" + req.body.replyid + "} WHERE userid=?";
    var quries = [
        {
            query: query1,
            params: req.body
        },
        {
            query: query2,
            params: req.body
        },
        {
            query: query3,
            params: [req.body.replyid, req.body.commentid, 4, req.body.userid, req.body.ofuserid, req.body.time]
        },
        {
            query: query4,
            params: [req.body.replyid, req.body.userid, req.body.ofuserid, 4, req.body.commentid, req.body.time]
        },
        {
            query: query5,
            params: req.body
        },
        {
            query: query6,
            params: [req.body.ofuserid]
        }
    ];

    var result = client.batch(quries, { prepare: true });
    result.then(result => res.send("reply added"), err => res.send(err));

};

collection.getAllReplyByCommentId = function (req, res) {
    const query1 = "SELECT replies FROM comment WHERE commentid=?";
    var result = client.execute(query1, [req.params.commentId], { prepare: true });
    result.then(result => {
        const query2 = "SELECT * FROM reply WHERE replyid IN ?";
        result = client.execute(query2, [result.rows[0].replies], { prepare: true });
        result.then(result => res.send(result.rows), err => console.log(err));
    }, err => console.log(err));
};

module.exports = collection;