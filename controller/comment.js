const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createComment = function (req, res) {
    req.body.commentid = TimeUuid.now();
    req.body.time = new Date();
    const query1 = "INSERT INTO comment (commentid,comment,postid,time,userid) VALUES (?,?,?,?,?)";
    const query2 = "UPDATE post SET comments = comments + {" + req.body.commentid + "} WHERE postid=?";
    const query3 = "INSERT INTO myactivity (activityid , activityobjectid , activitytype , byuser , ofuser , time ) VALUES (?,?,?,?,?,?)";
    const query4 = "INSERT INTO notification (notificationid,fromuser,touser,type,notificationobjectid,time) VALUES (?,?,?,?,?,?)";
    const query5 = "UPDATE user SET myactivity = myactivity + {" + req.body.commentid + "} WHERE userid=?";
    const query6 = "UPDATE user SET notifications = notifications + {" + req.body.commentid + "} WHERE userid=?";
    var queries = [
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
            params: [req.body.commentid, req.body.postid, 2, req.body.userid, req.body.ofuserid, req.body.time]
        },
        {
            query: query4,
            params: [req.body.commentid, req.body.userid, req.body.ofuserid, 2, req.body.postid, req.body.time]
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

    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        res.send(result);
    }, err => console.log(err));
};

collection.getAllCommentByPostId = function (req, res) {
    
};

collection.deleteCommentById = function (req, res) {

};

module.exports = collection;