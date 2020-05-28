const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

// SET VIEWS AND VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//APPLY COOKIE SESSION MIDDLEWARE
app.use(
	cookieSession({
		name: 'session',
		keys: [ 'key1', 'key2' ],
		maxAge: 3600 * 1000 //1hr
	})
);

//DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.render('login_register');
	}
	next();
};

const ifLoggedin = (req, res, next) => {
	if (req.session.isLoggedIn) {
		return res.redirect('/home');
	}
	next();
};

//END OF CUSTOM MIDDLEWARE

//ROOT PAGE

app.get('/', ifNotLoggedin, (req, res, next) => {
	dbConnection.execute('SELECT `name` FROM `users` WHERE `id`=?', [ req.session.userID ]).then(([ rows ]) => {
		res.render('home', {
			name: rows[0].name
		});
	});
});

//END OF ROOT PAGE

//REGISTER PAGE
app.post(
	'/register',
	ifLoggedin,
	// post data validation (using express-validator)
	[
		body('user_email', 'Invalid email address!').isEmail().custom((value) => {
			return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [ value ]).then(([ rows ]) => {
				if (rows.length > 0) {
					return Promise.reject('This E-mail is already in use!');
				}
				return true;
			});
		}),
		body('user_name', 'Username is empty').trim().not().isEmpty(),
		body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({ min: 6 })
	], //end of post data validation
	(req, res, next) => {
		const validation_result = validationResult(req);
		const { user_name, user_pass, user_email } = req.body;
		// IF validation_result has no error
		if (validation_result.isEmpty()) {
			//password encryption (bcrypt)
			bcrypt
				.hash(user_pass, 12)
				.then((hash_pass) => {
					//Inserting it into database
					dbConnection
						.execute('INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)', [
							user_name,
							user_email,
							hash_pass
						]) // displaying welcome page
						.then((result) => {
							res.render('reg_success', {
								title: result[0].name
							});
						})
						.catch((err) => {
							//Throw inserting user error's
							if (err) throw err;
						});
				})
				.catch((err) => {
					//Throw hashing error
					if (err) throw err;
				});
		} else {
			//COLLECTING ALL THE VALIDATION DATA
			let allErrors = validation_result.errors.map((error) => {
				return error.msg;
			});
			//RENDERING login_register PAGE WITH VALIDATION ERRORS
			res.render('login_register', {
				register_error: allErrors,
				old_data: req.body
			});
		}
	}
); //END OF REGISTER PAGE

//LOGIN PAGE
app.post(
	'/',
	ifLoggedin,
	[
		body('user_email').custom((value) => {
			return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [ value ]).then(([ rows ]) => {
				if (rows.length == 1) {
					return true;
				}
				return Promise.reject('Invalid email address!');
			});
		}),
		body('user_pass', 'Password is empty!').trim().not().isEmpty()
	],
	(req, res) => {
		const validation_result = validationResult(req);
		const { user_pass, user_email } = req.body;
		if (validation_result.isEmpty()) {
			dbConnection
				.execute('SELECT * FROM `users` WHERE `email`=?', [ user_email ])
				.then(([ rows ]) => {
					bcrypt
						.compare(user_pass, rows[0].password)
						.then((compare_result) => {
							if (compare_result === true) {
								req.session.isLoggedIn = true;
								req.session.userID = rows[0].id;

								res.redirect('/');
							} else {
								res.render('login_register', {
									login_errors: [ 'Invalid Password!' ]
								});
							}
						})
						.catch((err) => {
							if (err) throw err;
						});
				})
				.catch((err) => {
					if (err) throw err;
				});
		} else {
			let allErrors = validation_result.errors.map((error) => {
				return error.msg;
			});
			// REDERING login_register PAGE WITH LOGIN VALIDATION ERRORS
			res.render('login_register', {
				login_errors: allErrors
			});
		}
	}
);
//END OF LOGIN PAGE

//LOGOUT
app.get('/logout', (req, res) => {
	//session destroy
	req.session = null;
	res.redirect('/');
});

app.use('/', (req, res) => {
	res.status(404).send('<h1>404 Page Not Found</h1>');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is Running on port ${PORT}`));
