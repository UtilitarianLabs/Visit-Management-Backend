const express = require('express')

const app = express()
const cors = require("cors");
app.use(cors());
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
var browserSync = require('browser-sync');

var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var jsforce = require('jsforce');
const PORT = process.env.PORT || 5000
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/dist')); //public
var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl: 'https://test.salesforce.com'
});
conn.login('ajeet.kumar@utilitarianlab.com.sitevisit', 'ajeet@123', function(err, userInfo) {
    if (err) {
        console.log('Errorr::'+err);
         return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
});
console.log('conn::' + conn);
require('./routesapi')(app, conn);
require('./routeapi')(app, conn);



app.listen(PORT, () => { console.log(`Server running at http://localhost:` + PORT) })
exports = module.exports = app;