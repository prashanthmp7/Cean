const express = require('express');
const bcrypt = require('bcryptjs');
var Uuid = require("uuid");
const nJwt = require('njwt');
const config = require('./config');
var Couchbase = require('couchbase');
var N1qlQuery = Couchbase.N1qlQuery;
var cbUtil = require('./coucbaseUtil');
var bucket = cbUtil.getBucket();


const router = express.Router();

router.post('/register', function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  if (!req.body.name) {
    return res.status(400).send({ "message": "Missing `name` property" });
  } else if (!req.body.email) {
    return res.status(400).send({ "message": "Missing `email` property" });
  }
  else if (!req.body.password) {
    return res.status(400).send({ "message": "Missing `password` property" });
  }
  bucket.insert(Uuid.v4(),  { 'id': Uuid.v4(), 'name' : req.body.name, 'email' : req.body.email, 'password': hashedPassword, 'type': 'UserDao' }, function (error, result) {
    if (error)
      return res.status(500).send("An error occurred during registration");

    res.status(200).send({ status: 'ok' });
  });
});

router.post('/login', function (req, res) {

  var query = N1qlQuery.fromString("SELECT moviedb.* FROM moviedb where type ='UserDao' and email =$1").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  bucket.query(query, [req.body.email], function (error, user) {
    if (error) return res.status(500).send({ status: 'Server error', err: error });
    if (!user) return res.status(404).send('User not found');

    if (!bcrypt.compareSync(req.body.password, user[0].password)) {
      return res.status(401).send({ auth: false, token: null });
    }

    var jwt = nJwt.create({ id: user[0].id }, config.secret);
    jwt.setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000));

    res.status(200).send({ auth: true, token: jwt.compact(), user: user[0] });
  });
  
});

const jwtAuth = require('./auth');

router.get('/profile', jwtAuth, function (req, res, next) {
  var query = N1qlQuery.fromString("SELECT moviedb.* FROM moviedb where type ='UserDao' and id =$1").consistency(N1qlQuery.Consistency.REQUEST_PLUS);
  bucket.query(query, [req.userId], function (error, user) {
    if (error) {
      return res.status(500).send("There was a problem finding the user.");
    }
    if (!user) {
      return res.status(404).send("No user found.");
    }
    res.status(200).send(user[0]);
  });
});

router.post('/token', function (req, res, next) {
  var username = req.body.username
  var refreshToken = req.body.refreshToken
  if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == username)) {
    var user = {
      'username': username,
      'role': 'admin'
    }
    var token = jwt.sign(user, SECRET, { expiresIn: 300 })
    res.json({token: 'JWT ' + token})
  }
  else {
    res.send(401)
  }
});

router.post('/token/reject', function (req, res, next) { 
  var refreshToken = req.body.refreshToken 
  if(refreshToken in refreshTokens) { 
    delete refreshTokens[refreshToken]
  } 
  res.send(204) 
});
module.exports = router;


