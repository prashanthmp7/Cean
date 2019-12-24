var cbUtil = require('./coucbaseUtil');
var bucket = cbUtil.getBucket();
var Couchbase = require('couchbase');
var Uuid = require("uuid");
const express = require('express');

var N1qlQuery = Couchbase.N1qlQuery;
var router = express.Router();

router.get("/movies", function (req, res) {
    var query = N1qlQuery.fromString("SELECT moviedb.* FROM moviedb WHERE type = 'MovieDao'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(result);
    });
});

router.get("/movies/:title", function (req, res) {
    if (!req.params.title) {
        return res.status(400).send({ "message": "Miss-ing `title` parameter" });
    }
    var query = N1qlQuery.fromString("SELECT moviedb.* FROM moviedb WHERE type = 'MovieDao' and LOWER(name) LIKE '%' || $1 || '%'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, [req.params.title.toLowerCase()], function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(result);
    });
});

router.get("/users", function (req, res) {
    var query = N1qlQuery.fromString("SELECT moviedb.* FROM moviedb WHERE type = 'UserDao'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(result);
    });
});

router.post("/movies", function (req, res) {
    if (!req.body.name) {
        return res.status(400).send({ "message": "Missing `name` property" });
    } else if (!req.body.genre) {
        return res.status(400).send({ "message": "Missing `genre` property" });
    }
    var data = {
        'id' : Uuid.v4(),
        'name': req.body.name,
        'genre': req.body.genre,
        'formats':
        {
            'digital': req.body.formats.digital,
            'bluray': req.body.formats.bluray,
            'dvd': req.body.formats.dvd
        },
        'type': 'MovieDao'
    };
    bucket.insert(Uuid.v4(), data, function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(req.body);
    });
});



module.exports = router;