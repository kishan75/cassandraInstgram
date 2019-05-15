const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.addLike = function (req, res) {
    const notfid = TimeUuid.now();
    const query1 = `UPDATE reply SET like = like + {'${req.body.byuser}':'${notfid}'} where replyid = ? `;
    const query2 = `INSERT INTO notification (notificationid , fromuser , touser , type , time) VALUES (?,?,?,?,?)`;
    const query3 = `UPDATE user SET notifications = notifications +{'${notfid}'} where userid = ?`;
    const query4 = `INSERT INTO myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
    const queries = [
        {
            query: query1,
            params: [req.body.replyid]
        },
        {
            query: query2,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-reply', id: req.body.replyid},new Date()]
        },
        {
            query:query3,
            params: [req.body.ofuser]
        },
        {
            query: query4,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-reply', id: req.body.replyid},new Date()]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        
        res.send("reply liked");
    }, err => {
        console.log(err);
    });
};
collection.deleteLike = function (req, res) {
    const query1 = `UPDATE reply SET like = like - {'${req.body.byuser}'} where replyid = ? `;
    const query2 = `INSERT INTO notification (notificationid , fromuser , touser , type , time) VALUES (?,?,?,?,?)`;
    const query3 = `UPDATE user SET notifications = notifications +{'${notfid}'} where userid = ?`;
    const query4 = `INSERT INTO myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
    const queries = [
        {
            query: query1,
            params: [req.body.replyid]
        },
        {
            query: query2,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-reply', id: req.body.replyid},new Date()]
        },
        {
            query:query3,
            params: [req.body.ofuser]
        },
        {
            query: query4,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-reply', id: req.body.replyid},new Date()]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        
        res.send("reply liked");
    }, err => {
        console.log(err);
    });
};
module.exports = collection;
