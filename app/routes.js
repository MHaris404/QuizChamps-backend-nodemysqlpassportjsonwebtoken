module.exports = function (app, passport, SERVER_SECRET) {

	// default message
	app.get('/endpoint/v1/', function (req, res) {
		res.send(
			{ status: 'success', message: 'Welcome to the database' }
			// '<html><body><p>Welcome to the database</p></body></html>'
		);
	});

	// =========== authenticate login info and generate access token ===============

	app.post('/endpoint/v1/login', function (req, res, next) {
		passport.authenticate('local-login', function (err, user, info) {
			if (err) { return next(err); }
			// stop if it fails
			if (!user) {
				return res.json({
					status: false,
					message: 'Invalid Username or Password',
					info
				});
			}

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
				req.token = jwt.sign(
					{
						id: req.user.id, //id = username
					},
					SERVER_SECRET,
					{
						expiresIn: 300000
					}
				);

				// lastly respond with json
				return res.status(200).json({
					status: true,
					username: req.user.id,
					token: req.token,
					details: user
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
		res.json({
			status: true, message: 'User created',
			// details: req.session.passport 
		});
	});

	app.get('/signup/failurejson', function (req, res) {
		res.json({ status: false, message: "fail" });
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
					.json({ status: true, message: 'logout Successful' });
			} else {
				res
					.json({ status: false, message: err });
			}

		});
	});

	// =============================================================================

	// ==================== Allows users to check if logged in ========================

	app.get('/endpoint/v1/isloggedin', function (req, res) {
		if (req.isAuthenticated())
			if (req.session.id && req.user.username)
				res.status(200).send({ status: true, loggedIn: true, user: req.user });
			else
				res.status(401).send({ status: false, loggedIn: false });
		else {
			res.status(401).send({ status: false, authenticated: false });
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
	//app.get('/endpoint/v1/product/api/get/all', authenticate, REST_GET.getAllRecords);

	// GET, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/get?c={target_column}&q={target_value}&order={orderby}
	//app.get('/endpoint/v1/get/currUserDetails', authenticate, REST_GET.findByColumn);

	// GET, EndPoint:
	// https://127.0.0.1:5000/endpoint/v1/product/api/get/search/?c={target_column}&start={start}&end={end}&order={orderby}
	//app.get('/endpoint/v1/product/api/get/search', authenticate, REST_GET.rangeSearch);

	// GET, EndPoint:
	// https://127.0.0.1:5000/endpoint/v1/get/category/all
	app.get('/endpoint/v1/get/category/all', authenticate, REST_GET.getAllCategories);

	// GET, EndPoint:
	// https://127.0.0.1:5000/endpoint/v1/get/question?categoryid
	app.get('/endpoint/v1/get/question', authenticate, REST_GET.getQuestionsbyCategoryid);

	// GET, EndPoint:
	// http://10.1.101.206:5000/endpoint/v1/get/option?questionid=3
	// app.get('/endpoint/v1/get/option', authenticate, REST_GET.getOptionsbyQuestionId);
 
	// GET, EndPoint:
	// http://10.1.101.206:5000/endpoint/v1/get/score?userid=1
	app.get('/endpoint/v1/get/score', authenticate, REST_GET.getScorebyUser);

	// GET, EndPoint:
	// http://10.1.101.206:5000/endpoint/v1/get/getScores123
	app.get('/endpoint/v1/get/getScores123', authenticate, REST_GET.getScores123);

	// GET, EndPoint:
	// http://10.1.101.206:5000/endpoint/v1/get/getScores4567
	app.get('/endpoint/v1/get/getScores4567', authenticate, REST_GET.getScores4567);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/add/category?categoryName=&categoryScore=
	app.post('/endpoint/v1/add/category', authenticate, REST_POST.addOneCategory);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/add/question?option1?option2?option3?option4?correctOption?
	app.post('/endpoint/v1/add/question', authenticate, REST_POST.addOneQuestion);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/add/option?
	// app.post('/endpoint/v1/add/option', authenticate, REST_POST.addOptions);

	// POST, Endpoint:
	// https://127.0.0.1:5000/endpoint/v1/add/score?
	////http://${IP}:5000/endpoint/v1/add/score?userCategoryScore=${score}&categoryid=${catId}&usersid=${userid}&categoryName=${science}
	app.post('/endpoint/v1/add/score', authenticate, REST_POST.addUserCategoryScore);

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
