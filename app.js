var express  = require('express');
var app      = express();
var port     = process.env.PORT || 9091;
app.set('view engine', 'ejs'); // set up ejs for templating
var path = __dirname + '/gps-FT/template';
app.use('/',express.static('gps-FT/'));
app.use('/node_modules',express.static('node_modules/'));
app.get('/', function(req, res){
 res.sendfile(__dirname + '/gps-FT/index.html');
 });
app.listen(port);
console.log('The GPS Frontend running on ' + port);
