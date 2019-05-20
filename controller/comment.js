const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createComment = function (req, res) {
    req.body.commentid = TimeUuid.now();
    req.body.time = new Date();
    const query1 = "INSERT INTO comment (commentid,comment,postid,time,userid) VALUES (?,?,?,?,?)";
    const query2 = "INSERT INTO myactivity (activityid , activityobjectid , activitytype , byuser , ofuser , time ) VALUES (?,?,?,?,?,?)";
    const query3 = "INSERT INTO notification (notificationid,byuser,ofuser,type,notificationobjectid,time) VALUES (?,?,?,?,?,?)";
    var queries = [
        {
            query: query1,
            params: req.body
        },
        {
            query: query2,
            params: [req.body.commentid, req.body.postid, 2, req.body.userid, req.body.ofuserid, req.body.time]
        },
        {
            query: query3,
            params: [req.body.commentid, req.body.userid, req.body.ofuserid, 2, req.body.postid, req.body.time]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        const query4 = "UPDATE comment_count SET comment_count = comment_count + 1 where postid = ? ";
        result = client.execute(query4, req.body, { prepare: true });
        result.then(result => res.send(result), err => console.log(err));
    }, err => console.log(err));
};

collection.getAllCommentByPostId = function (req, res) {
    var result;
    if (req.params.time) {
        const query1 = "SELECT * FROM comment WHERE postid=? AND time < ? LIMIT 10";
        result = client.execute(query1, req.params, { prepare: true });
    }
    else {
        const query2 = "SELECT * FROM comment WHERE postid=? LIMIT 10";
        result = client.execute(query2, req.params, { prepare: true });
    }
    result.then(result => res.send(result.rows), err => console.log(err));
};

collection.deleteCommentById = function (req, res) {

};

module.exports = collection;






