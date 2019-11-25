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

var app = Express();
app.use(BodyParser.json());
app.use(Cors());
app.use(BearerToken())

app.use('/', profile)
app.use('/', movies);


app.listen(3000, function() {
    console.log("Starting server on port 3000...");
});
