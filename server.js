// get all the tools needed
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

var app = express();

var port = process.env.PORT || 5000;
var passport = require('passport');
var flash = require('connect-flash');
var fs = require('fs');
var https = require('https');

// config passport and connect to DB
require('./config/passport')(passport);

// set up express
app.use(cors());

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// config passport
app.use(cors())
app.use(session({
	secret: 'harisSessionSecret',
	resave: true,
	saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Set Https certificate
// var options = {
// 	key: fs.readFileSync('privateKey.key'),
// 	cert: fs.readFileSync('certificate.crt')
// };

const SERVER_SECRET = 'harisServerSecret';

// routes
require('./app/routes.js')(app, passport, SERVER_SECRET); // load our routes and pass in our app and fully configured passport

// Create server
// https.createServer(options, app)
app.listen(port, function () {
	console.log('Server listening on port ' + port);
});
