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
    const query1 = "SELECT comments FROM post WHERE postid=?";
    var result = client.execute(query1, [req.params.postId], { prepare: true });

    result.then(result => {
        const query2 = "SELECT * FROM comment WHERE commentid IN ?";
        result = client.execute(query2, [result.rows[0].comments], { prepare: true });
        result.then(result => res.send(result.rows), err => console.log(err));
    }, err => console.log(err));
};

collection.deleteCommentById = function (req, res) {

};


collection.addLike = function (req, res) {
  const notfid = TimeUuid.now();
  const query1 = `UPDATE post SET like = like + {'${req.body.byuser}':${notfid}} where postid = ? `;
  const query2 = `INSERT INTO notification (notificationid , fromuser , touser , type , time) VALUES (?,?,?,?,?)`;
  const query3 = `UPDATE user SET notifications = notifications +['${notfid}'] where userid = ?`;
  const query4 = `INSERT INTO myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
  const query5 = `UPDATE user SET myactivity = myactivity +['${notfid}'] where userid = ?`;
  
  const queries = [
      {
          query: query1,
          params: [req.body.postid]
      },
      {
          query: query2,
          params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-comment', id: req.body.postid},new Date()]
      },
      {
          query:query3,
          params: [req.body.ofuser]
      },
      {
          query: query4,
          params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-comment', id: req.body.postid},new Date()]
      },
      {
          query:query5,
          params: [req.body.ofuser]
      },
  ];

  client.batch(queries, { prepare: true })
  .then(result => {
      console.log(result);  
      res.send("comment liked");
    }, err => {
    console.log(err);
  });

  client.execute(`SELECT * FROM user where userid IN [?,?]`,[req.user.ofuser,req.byuser])
  .then(res=>{
    let ntl = res.row[0].notifications.length;
    let acl = res.row[1].myactivity.length;
    if(ntl>500){
      client.execute(`DELETE notification[${ntl-1}] FROM user WHERE userid =${req.body.ofuser}`); 
    }
    if(acl>500){
      client.execute(`DELETE myactivity[${acl-1}] FROM user WHERE userid =${req.body.byuser}`);     
    }
  });
}
collection.deleteLike = function (req, res) {
    SELECT like[req.body.byuser] from comment where commentid = req.body.commentid;
    const query1 = `DELETE like[${req.body.byuser}] FROM comment where  = ? `;
    const query2 = `DELETE FROM notification WHERE notificationid = ${notfid}`;
    const query3 = `DELETE notifications['notifiuser SET notifications = notifications -{'${req.body.notfid}'} where userid = ?`;
    const query4 = `DELETE  myactivity (activityid,byuser,ofuser,type,time) VALUES(?,?,?,?,?)`;
    const query5 = `UPDATE user SET myactivity = myactivity -{'${req.body.notfid}'} where userid = ?`;
 
    const queries = [
        {
            query: query1,
            params: [req.body.postid]
        },
        {
            query: query2,
            params: [notfid,req.body.byuser,req.body.ofuser,{message:'like-comment', id: req.body.postid},new Date()]
        },
        {
            query:query3,
            params: [req.body.ofuser]
        },
        {
            query: query4,
            params: [activityid,req.body.byuser,req.body.ofuser,{message:'like-comment', id: req.body.postid},new Date()]
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