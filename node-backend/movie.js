var cbUtil = require('./coucbaseUtil');
var bucket = cbUtil.getBucket();
var Couchbase = require('couchbase');
const { uuid } = require('uuidv4');
const express = require('express');

var N1qlQuery = Couchbase.N1qlQuery;
var router = express.Router();

router.get("/movies", function (req, res) {
    var query = N1qlQuery.fromString("SELECT MovieDb.* FROM MovieDb WHERE type = 'MovieDao'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
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
    var query = N1qlQuery.fromString("SELECT MovieDb.* FROM MovieDb WHERE type = 'MovieDao' and LOWER(name) LIKE '%' || $1 || '%'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, [req.params.title.toLowerCase()], function (error, result) {
        if (error) {
            var N1qlQuery = query;
            return res.status(400).send({ "message": error });
        }
        res.send(result);
    });
});

router.get("/users", function (req, res) {
    var query = N1qlQuery.fromString("SELECT MovieDb.* FROM MovieDb WHERE type = 'UserDao'").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
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
        'id' : uuid(),
        'name': req.body.name,
        'genre': req.body.genre,
        'formats':
        {
            'digital': req.body.formats.digital,
            'bluray': req.body.formats.bluray,
            'dvd': req.body.formats.dvd
        },
        'thumbnailData': req.body.thumbnailData[0].id,
        'type': 'MovieDao'
    };
    bucket.insert(data.id, data, function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(req.body);
    });
});

router.get("/movies/delete/:id", function (req, res) {
    var query = N1qlQuery.fromString("Delete FROM MovieDb WHERE type = 'MovieDao' and id= $1").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query,[req.params.id.toLowerCase()], function (error, result) {
        if (error) {
            return res.status(400).send({ "message": false });
        }
        res.send(true);
    });
});



module.exports = router;