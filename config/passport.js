// load all the things needed
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function (passport) {

    // passport set up; required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ", [id], function (err, rows) {
            done(err, rows[0]);
        });
    });

    // handles signup Username
    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {

                var today = new Date();
                var { fname, lname, email } = req.body;

                connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already in use.'));
                    } else {

                        // if there is no user with that username then create the user
                        var newUserMysql = {
                            username,
                            fname,
                            lname,
                            email,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),  // use the generateHash function in our user model
                            createdAt: today,
                            updatedAt: today
                        };

                        var insertQuery = "INSERT INTO users ( username, fname, lname, email, password, created_at, updated_at) values (?,?,?,?,?,?,?)";

                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.fname, newUserMysql.lname, newUserMysql.email, newUserMysql.password, newUserMysql.createdAt, newUserMysql.updatedAt],
                            function (err, rows) {
                                if (err)
                                    return done(err);
                                newUserMysql.id = rows.insertId;
                                return done(null, newUserMysql);
                            });

                    }
                });
            })
    );

    // handles login
    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {

                var query = ""

                if (username.includes("@") ? query = 'email' : query = 'username')

                    connection.query("SELECT * FROM users WHERE " + query + " = ?", [username], function (err, rows) {

                        console.log(connection.query)

                        if (err)
                            return done(err);
                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'No user found.'));
                        }

                        // if the user is found but the password is wrong
                        if (!bcrypt.compareSync(password, rows[0].password))
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                        // all is well, return successful user
                        return done(null, rows[0]);
                    });
            })
    );
};
