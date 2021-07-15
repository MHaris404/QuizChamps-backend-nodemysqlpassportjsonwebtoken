module.exports = function (app, passport, SERVER_SECRET) {

	// default message
	app.get('/endpoint/v1/', function (req, res) {
		res.send('<html><body><p>Welcome to the database</p></body></html>');
	});

	// =========== authenticate login info and generate access token ===============

	app.post('/endpoint/v1/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user, info) {
			if (err) { return next(err); }
			// stop if it fails
			if (!user) { return res.json({ status: 'failure', message: 'Invalid Username or Password' }); }

			req.logIn(user, function (err) {
				// return if does not match
				if (err) { return next(err); }

				// generate token if it succeeds
				const db = {
					updateOrCreate: function (user, cb) {
						cb(null, user);
					}
				};
				db.updateOrCreate(req.user, function (err, user) {
					if (err) { return next(err); }
					// store the updated information in req.user again
					req.user = {
						id: user.username
					};
				});

				// create token
				const jwt = require('jsonwebtoken');
				req.token = jwt.sign({
					id: req.user.id,
				}, SERVER_SECRET, {
					expiresIn: 60 * 60 //1hr
				});

				// lastly respond with json
				return res.status(200).json({
					status: 'success',
					username: req.user.id,
					token: req.token
				});
			});
		})(req, res, next);
	});

	// =============================================================================

	// ==================== Allows users to create accounts ========================

	app.post('/endpoint/v1/signup', passport.authenticate('local-signup', {
		successRedirect: '/signup/successjson',
		failureRedirect: '/signup/failurejson',
		failureFlash: true
	}));
	// return messages for signup users
	app.get('/signup/successjson', function (req, res) {
		res.json({ status: 'success', message: 'User created', user: req.user.username, });
	});

	app.get('/signup/failurejson', function (req, res) {
		res.json({ status: 'failure', message: 'User already exists' });
	});

	// =============================================================================

	// ==================== Allows users to log out of accounts ========================

	app.post('/endpoint/v1/logout', function (req, res, next) {
		req.logout();
		req.session.destroy(function (err) {
			if (!err) {
				res
					.status(200)
					.clearCookie('connect.sid', { path: '/' })
					.json({ status: 'success', message: 'logout' });
			} else {
				res
					.json({ status: 'failure', message: err });
			}

		});
	});

	// =============================================================================

	// ==================== Allows users to check if logged in ========================

	app.get('/endpoint/v1/isloggedin', function (req, res) {
		if (!req.isAuthenticated())
			res.status(401).send({ status: 'failure', authenticated: 'false' });
		else {
			if (req.session.id && req.user.username)
				res.status(200).send({ status: 'success', loggedIn: 'true', user: req.user.username });
			else
				res.status(401).send({ status: 'failure', loggedIn: 'false' });
		}
	});

	// =============================================================================

	// ================= Protected APIs for authenticated Users ====================

	// get tools and routes
	var expressJwt = require('express-jwt'),
		REST_POST = require('../routes/REST_POST'),
		REST_GET = require('../routes/REST_GET'),
		REST_EDIT = require('../routes/REST_EDIT'),
		REST_DELETE = require('../routes/REST_DELETE');

	// authenticate access token
	const authenticate = expressJwt({ secret: SERVER_SECRET });

	// GET, EndPoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/all?order={orderby}
	app.get('/endpoint/v1/product/api/get/all', authenticate, REST_GET.getAllRecords);

	// GET, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/get?c={target_column}&q={target_value}&order={orderby}
	app.get('/endpoint/v1/product/api/get', authenticate, REST_GET.findByColumn);

	// GET, EndPoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/get/search/?c={target_column}&start={start}&end={end}&order={orderby}
	app.get('/endpoint/v1/product/api/get/search', authenticate, REST_GET.rangeSearch);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/add?content=1,2,3...
	app.post('/endpoint/v1/product/api/add', authenticate, REST_POST.addOne);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/add/batch?content[0]=1,2,3,...&content[1]=1,2,3...
	app.post('/endpoint/v1/product/api/add/batch/', authenticate, REST_POST.addBatch);

	// EDIT, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/edit/:orderID/?content={}
	app.post('/endpoint/v1/product/api/edit/:id', authenticate, REST_EDIT);

	// Endpoint: https://127.0.0.1:5000/endpoint/v1/product/api/delete/?id={orderID}
	app.delete('/endpoint/v1/product/api/delete/', authenticate, REST_DELETE);

	// =============================================================================

}
