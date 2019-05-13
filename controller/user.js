var collection = {};

const client = require("../config/connectionToCassandra");

collection.registerUser = function (req, res) {
    var query = "INSERT into user ( userid,dob,email,firstname,lastname,phone,registrationdate,username) VALUES( now(),?,?,?,?,?,?,?)";
    

};