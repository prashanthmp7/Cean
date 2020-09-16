var Couchbase = require("couchbase");
const url = "couchbase://localhost";

var _bucket;

module.exports = {
    connectToServer: function (callback) {
        var cluster = new Couchbase.Cluster(url);
        cluster.authenticate('Administrator', 'Administrator');
        _bucket = cluster.openBucket('MovieDb', function (err) {
            if (err) {
                console.error('Got error: %j', err);
            }
        });

        _bucket.operationTimeout = 120 * 1000;
    },

    getBucket: function ()  {
        return _bucket;
    }
};