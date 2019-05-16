const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.createPost = function (req, res) {
    if (req.file == undefined) { 
        res.status(400).send("please select a image file");
        return;
    }
    req.body.postid = TimeUuid.now();
    req.body.imagepath = '/' + req.file.path;
    req.body.time = new Date();
    const query1 = "INSERT INTO post (postid , userid , imagepath , time , caption) VALUES (?,?,?,?,?)";
    const query2 = "UPDATE user SET post = post + {" + req.body.postid + " } where userid = ? ";
    const queries = [
        {
            query: query1,
            params: req.body
        },
        {
            query: query2,
            params: [req.body.userid]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        res.send("posted");
    }, err => {
        console.log(err);
    });
};

collection.addLike = function (req, res) {
    const notfid = TimeUuid.now();
    const query1 = `UPDATE post SET like = like + {'${req.body.byuser}'} where postid = ? `;
    const query2 = `INSERT INTO notification (notificationid , fromuser , touser , type , time) VALUES (?,?,?,?,?)`;
    const query3 = `UPDATE user SET notifications = notifications +{'${notfid}'} where userid = ?`;
    const query4 = `INSERT INTO myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
    const query5 = `UPDATE user SET myactivity = myactivity +{'${notfid}'} where userid = ?`;
 
    const queries = [
        {
            query: query1,
            params: [req.body.postid]
        },
        {
            query: query2,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-post', id: req.body.postid},new Date()]
        },
        {
            query:query3,
            params: [req.body.ofuser]
        },
        {
            query: query4,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-post', id: req.body.postid},new Date()]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        
        res.send("post liked");
    }, err => {
        console.log(err);
    });
};

collection.deleteLike = function (req, res) {
    const notfid = TimeUuid.now();
    const activityid = TimeUuid.now()
    const query1 = `UPDATE post SET like = like + {'${req.body.byuser}'} where postid = ? `;
    const query2 = `INSERT INTO notification (notificationid , fromuser , touser , type , time) VALUES (?,?,?,?,?)`;
    const query3 = `UPDATE user SET notifications = notifications +{'${notfid}'} where userid = ?`;
    const query4 = `INSERT INTO myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
    const queries = [
        {
            query: query1,
            params: [req.body.postid]
        },
        {
            query: query2,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-post', id: req.body.postid},new Date()]
        },
        {
            query:query3,
            params: [req.body.ofuser]
        },
        {
            query: query4,
            params: [activityid,req.body.byuser,req.body.ofuser,{message:'like-post', id: req.body.postid},new Date()]
        }
    ];
    var result = client.batch(queries, { prepare: true });
    result.then(result => {
        console.log(result);
        
        res.send("post liked");
    }, err => {
        console.log(err);
    });
};
module.exports = collection;
