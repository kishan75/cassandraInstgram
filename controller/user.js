const client = require("../config/connectionToCassandra");
var dateFormat = require('dateformat');
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.registerUser = function (req, res) {
    req.body.registrationdate = dateFormat(new Date(), 'yyyy-mm-dd');
    req.body.dob = dateFormat(req.body.dob, 'yyyy-mm-dd');
    req.body.userid = TimeUuid.now();
    console.log(req.body.userid);
    var query = "INSERT into user ( userid,dob,email,firstname,lastname,phone,registrationdate,username) VALUES( ?,?,?,?,?,?,?,?)";
    var result = client.execute(query, req.body, { prepare: true });
    result.then(result => console.log(result), err => console.log(err));
    res.send(result);
};

module.exports = collection;
