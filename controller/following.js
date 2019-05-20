const client = require("../config/connectionToCassandra");
const TimeUuid = require('cassandra-driver').types.TimeUuid;

var collection = {};

collection.addFollowing = function (req, res) { };

collection.getFollowing = function (req, res) { };

collection.removeFollowing = function (req, res) { };

module.exports = collection;