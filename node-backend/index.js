const Cors = require("cors");
const Express = require("express");
const BodyParser = require('body-parser');
const BearerToken = require('express-bearer-token');

var cb = require('./coucbaseUtil' );
cb.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );
var movies = require('./movie');
const profile = require('./profile');
const uploads = require('./upload');

var app = Express();

app.use(BodyParser.json({limit: '50mb'}));
app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });
app.use(Cors());
app.use(BearerToken())

app.use('/', profile)
app.use('/', movies);
app.use('/', uploads)


app.listen(3000, function() {
    console.log("Starting server on port 3000...");
});
