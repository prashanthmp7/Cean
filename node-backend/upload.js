const express = require('express');
var router = express.Router();
var cbUtil = require('./coucbaseUtil');
var Uuid = require("uuid");
var bucket = cbUtil.getBucket();
var Couchbase = require('couchbase');
var multer = require("multer");
var fs = require("fs");

var N1qlQuery = Couchbase.N1qlQuery;

router.post("/upload", multer({ dest: "./uploads/" }).array("uploads", 12), function (req, res) {
    var fileInfo = [];
    for (var i = 0; i < req.files.length; i++) {
        var buffer = fs.readFileSync(req.files[i].path);
        var docId = Uuid.v4();
        fileInfo.push({
            "id": docId,
            "originalName": req.files[i].originalname,
            "size": req.files[i].size,
            "b64": Buffer.from(buffer).toString("base64"),
            "type": "ThumbnailDataDao"
        });
        var filePath = req.files[i].path;
        fs.unlink(filePath, function () { console.log('File deleted') });
    }
    var statement = "INSERT INTO `MovieDb` (KEY,VALUE) VALUES ($1, {'files': $2})";
    var query = N1qlQuery.fromString(statement);
    bucket.query(query, [docId, fileInfo], function (error, result) {
        if (error) {
            return res.status(400).send({ "status": "error", "message": error });
        }
        res.send(fileInfo);
    });

});

router.get("/upload/images/:id", function (req, res) {
    if (!req.params.id) {
        return res.status(400).send({ "message": "Miss-ing `id` parameter" });
    }
    var query = N1qlQuery.fromString("SELECT MovieDb.* FROM MovieDb WHERE ANY val IN files SATISFIES val.id =$1 END").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
    bucket.query(query, [req.params.id.toLowerCase()], function (error, result) {
        if (error) {
            return res.status(400).send({ "message": error });
        }
        res.send(result);
    });
});


module.exports = router;