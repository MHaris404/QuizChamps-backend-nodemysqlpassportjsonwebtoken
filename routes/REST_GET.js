// Given a certain column and target value, get records
// endpoint/v1/get/currUserDetails/?c={target_column}&q={target_value}&order={orderby}
exports.findByColumn = function (req, res) {
	var connection = require('../model/dbconnection');
	var column = req.query.c;
	var val = req.query.q;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'id';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 100;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	connection.query('SELECT * from users where ?? = ? ORDER BY ?? DESC LIMIT ? OFFSET ?',
		[column, val, order, limit, offset], function (err, rows, fields) {
			if (!err) {
				var response = [];

				if (rows.length != 0) {
					response.push({ 'result': 'success', 'data': rows });
				} else {
					response.push({ 'result': 'error', 'msg': 'No Results Found' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send(err);
			}
		});
};

// Get all records
// endpoint/v1/product/api/get/all?order={orderby}
exports.getAllRecords = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'id';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 100;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	connection.query('SELECT * from users ORDER BY ?? ASC LIMIT ? OFFSET ?',
		[order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {
				var response = [];

				if (rows.length != 0) {
					response.push({ 'result': 'success', 'data': rows });
				} else {
					response.push({ 'result': 'error', 'msg': 'No Results Found' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send(err);
			}
		});
};

// Given a certain column and a range of values, get records in range
// endpoint/v1/product/api/get/search/?c={target_column}&s={start}&e={end}&order={orderby}
// exports.rangeSearch = function (req, res) {
// 	var connection = require('../model/dbconnection');
// 	var column = req.query.c;
// 	var startVal = req.query.s;
// 	var endVal = req.query.e;

// 	// If order not speficied, then use order date
// 	if (typeof req.query.order == 'undefined') {
// 		var order = 'Order_Date';
// 	} else {
// 		var order = req.query.order;
// 	}

// 	// get value of limit
// 	if (typeof req.query.limit == 'undefined') {
// 		var limit = 100;
// 	} else {
// 		var limit = parseInt(req.query.limit);
// 	}

// 	if (limit > 500 || limit < 1) {
// 		limit = 100;
// 	}

// 	// get offset value from requested page
// 	if (typeof req.query.page == 'undefined') {
// 		var page = 1;
// 	} else {
// 		var page = parseInt(req.query.page);
// 	}

// 	var offset = limit * (page - 1);

// 	connection.query('SELECT * from users WHERE ?? > ? AND ?? < ? ORDER BY ?? DESC LIMIT ? OFFSET ?',
// 		[column, startVal, column, endVal, order, limit, offset], function (err, rows, fields) {
// 			if (!err) {
// 				var response = [];

// 				if (rows.length != 0) {
// 					response.push({ 'result': 'success', 'data': rows });
// 				} else {
// 					response.push({ 'result': 'error', 'msg': 'No Results Found' });
// 				}

// 				res.setHeader('Content-Type', 'application/json');
// 				res.status(200).send(JSON.stringify(response));
// 			} else {
// 				res.status(400).send(err);
// 			}
// 		});
// };

// /endpoint/v1/get/category/all
exports.getAllCategories = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'id';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 100;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	connection.query('SELECT * from categories ORDER BY ?? ASC LIMIT ? OFFSET ?',
		[order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {
				var response = [];

				if (rows.length != 0) {
					response.push({ status: true, result: rows });
				} else {
					response.push({ status: false, 'msg': 'No Results Found' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send(err);
			}
		});
};

// http://10.1.101.206:5000/endpoint/v1/get/question?categoryid=3
exports.getQuestionsbyCategoryid = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	let categoryid = req.query.categoryid;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'id';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 100;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	connection.query('SELECT * from questions WHERE categoryid = ' + categoryid + ' ORDER BY ?? ASC LIMIT ? OFFSET ?',
		[order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {
				var response = [];

				if (rows.length != 0) {
					response.push({ status: true, result: rows });
				} else {
					response.push({ status: false, 'msg': 'No Results Found' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send(err);
			}
		});
};

// http://10.1.101.206:5000/endpoint/v1/get/option?questionid=3
// exports.getOptionsbyQuestionId = function (req, res) {
// 	var connection = require('../model/dbconnection');
// 	var val = req.query.q;

// 	let questionid = req.query.questionid;

// 	// If order not speficied, then use order date
// 	if (typeof req.query.order == 'undefined') {
// 		var order = 'id';
// 	} else {
// 		var order = req.query.order;
// 	}

// 	// get value of limit
// 	if (typeof req.query.limit == 'undefined') {
// 		var limit = 100;
// 	} else {
// 		var limit = parseInt(req.query.limit);
// 	}

// 	if (limit > 500 || limit < 1) {
// 		limit = 100;
// 	}

// 	// get offset value from requested page
// 	if (typeof req.query.page == 'undefined') {
// 		var page = 1;
// 	} else {
// 		var page = parseInt(req.query.page);
// 	}

// 	var offset = limit * (page - 1);

// 	connection.query('SELECT * from options WHERE questionid = ' + questionid + ' ORDER BY ?? ASC LIMIT ? OFFSET ?',
// 		[order, limit, offset]
// 		, function (err, rows, fields) {
// 			if (!err) {
// 				var response = [];

// 				if (rows.length != 0) {
// 					response.push({ status: true, result: rows });
// 				} else {
// 					response.push({ status: false, 'msg': 'No Results Found' });
// 				}

// 				res.setHeader('Content-Type', 'application/json');
// 				res.status(200).send(JSON.stringify(response));
// 			} else {
// 				res.status(400).send(err);
// 			}
// 		});
// };

// http://10.1.101.206:5000/endpoint/v1/get/score?userid=1
exports.getScorebyUser = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	let userid = req.query.userid;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'userCategoryScore';
	} else {
		var order = req.query.order;
	}

	// If order not speficied, then use order date
	if (typeof req.query.group == 'undefined') {
		var group = 'categoryid';
	} else {
		var group = req.query.group;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 3;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	connection.query('SELECT categoryName,userCategoryScore from scores WHERE usersid = ' + userid + ' GROUP BY ?? ORDER BY ?? DESC LIMIT ? OFFSET ? ',
		[group, order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {
				var response = [];

				if (rows.length != 0) {
					response.push({ status: true, result: rows });
				} else {
					response.push({ status: false, 'msg': 'No Results Found' });
				}

				res.setHeader('Content-Type', 'application/json');
				res.status(200).send(JSON.stringify(response));
			} else {
				res.status(400).send(err);
			}
		});
};

// http://10.1.101.206:5000/endpoint/v1/get/getScores123
exports.getScores123 = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'userCategoryScore';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 3;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = limit * (page - 1);

	var response = [];
	var final = [];

	connection.query('SELECT usersid, userCategoryScore FROM scores ORDER BY ?? DESC LIMIT ? OFFSET ? ',
		[order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {

				connection.query(`SELECT username FROM users WHERE id = ${rows[0].usersid}`
					, function (err, innerrows, fields) {

						if (!err) {
							if (innerrows.length != 0) {

								final.push({
									name: innerrows[0].username,
									score: rows[0].userCategoryScore
								});

								connection.query(`SELECT username FROM users WHERE id = ${rows[1].usersid}`
									, function (err, innerrows, fields) {

										if (!err) {
											if (innerrows.length != 0) {

												final.push({
													name: innerrows[0].username,
													score: rows[1].userCategoryScore
												});

												connection.query(`SELECT username FROM users WHERE id = ${rows[2].usersid}`
													, function (err, innerrows, fields) {

														if (!err) {
															if (innerrows.length != 0) {

																final.push({
																	name: innerrows[0].username,
																	score: rows[2].userCategoryScore
																});

																response.push({ status: true, result: final })
																res.setHeader('Content-Type', 'application/json');
																res.status(200).send(JSON.stringify(response));

															} else {
																response.push({ status: false, 'msg': 'No Results Found' });
															}

														} else {
															res.status(400).send(err);
														}
													})

											} else {
												response.push({ status: false, 'msg': 'No Results Found' });
											}

										} else {
											res.status(400).send(err);
										}
									})

							} else {
								response.push({ status: false, 'msg': 'No Results Found' });
							}

						} else {
							res.status(400).send(err);
						}
					})


			} else {
				res.status(400).send(err);
			}
		});
};

// http://10.1.101.206:5000/endpoint/v1/get/getScores4567
exports.getScores4567 = function (req, res) {
	var connection = require('../model/dbconnection');
	var val = req.query.q;

	// If order not speficied, then use order date
	if (typeof req.query.order == 'undefined') {
		var order = 'userCategoryScore';
	} else {
		var order = req.query.order;
	}

	// get value of limit
	if (typeof req.query.limit == 'undefined') {
		var limit = 4;
	} else {
		var limit = parseInt(req.query.limit);
	}

	if (limit > 500 || limit < 1) {
		limit = 100;
	}

	// get offset value from requested page
	if (typeof req.query.page == 'undefined') {
		var page = 1;
	} else {
		var page = parseInt(req.query.page);
	}

	var offset = 3
	// limit * (page - 1);

	var response = [];
	var final = [];

	connection.query('SELECT usersid, userCategoryScore FROM scores ORDER BY ?? DESC LIMIT ? OFFSET ? ',
		[order, limit, offset]
		, function (err, rows, fields) {
			if (!err) {

				connection.query(`SELECT username FROM users WHERE id = ${rows[0].usersid}`
					, function (err, innerrows, fields) {

						if (!err) {
							if (innerrows.length != 0) {

								final.push({
									name: innerrows[0].username,
									score: rows[0].userCategoryScore
								});

								connection.query(`SELECT username FROM users WHERE id = ${rows[1].usersid}`
									, function (err, innerrows, fields) {

										if (!err) {
											if (innerrows.length != 0) {

												final.push({
													name: innerrows[0].username,
													score: rows[1].userCategoryScore
												});

												connection.query(`SELECT username FROM users WHERE id = ${rows[2].usersid}`
													, function (err, innerrows, fields) {

														if (!err) {
															if (innerrows.length != 0) {

																final.push({
																	name: innerrows[0].username,
																	score: rows[2].userCategoryScore
																});

																connection.query(`SELECT username FROM users WHERE id = ${rows[3].usersid}`
																	, function (err, innerrows, fields) {

																		if (!err) {
																			if (innerrows.length != 0) {

																				final.push({
																					name: innerrows[0].username,
																					score: rows[3].userCategoryScore
																				});

																				response.push({ status: true, result: final })
																				res.setHeader('Content-Type', 'application/json');
																				res.status(200).send(JSON.stringify(response));

																			} else {
																				response.push({ status: false, 'msg': 'No Results Found' });
																			}

																		} else {
																			res.status(400).send(err);
																		}
																	})
															} else {
																response.push({ status: false, 'msg': 'No Results Found' });
															}

														} else {
															res.status(400).send(err);
														}
													})

											} else {
												response.push({ status: false, 'msg': 'No Results Found' });
											}

										} else {
											res.status(400).send(err);
										}
									})

							} else {
								response.push({ status: false, 'msg': 'No Results Found' });
							}

						} else {
							res.status(400).send(err);
						}
					})


			} else {
				res.status(400).send(err);
			}
		});
};