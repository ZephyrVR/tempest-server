var config   = require('./config/config');
var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var port     = config.port;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('cookie-session');
var configDB     = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

if (config.expressLogging) {
	app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

app.use(session({ secret: config.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(flash());

require('./app/routes')(app, passport);
require('./app/ws')(io);

server.listen(port);
console.log('Now running on port ' + port);