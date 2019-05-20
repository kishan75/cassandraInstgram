const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.addFollower = function (req, res) { };

collection.getFollowers = function (req, res) { };

collection.removeFollower = function (req, res) { };

module.exports = collection;