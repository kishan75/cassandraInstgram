const cassandra = require('cassandra-driver');


const client = new cassandra.Client(
    {
        contactPoints: [process.env.CASSANDRA_IP || '127.0.0.1:9042'],
        localDataCenter: 'datacenter1',
        keyspace: 'instagramdemo'
    });
module.exports=client;