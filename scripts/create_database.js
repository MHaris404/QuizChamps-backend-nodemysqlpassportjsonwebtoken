var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE IF NOT EXISTS ' + dbconfig.database);

connection.query('USE ' + dbconfig.database);
// + dbconfig.database + '`.`'
// IF NOT EXISTS 
connection.query('\
CREATE TABLE IF NOT EXISTS ' + dbconfig.users_table +
    '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `fname` VARCHAR(20) NOT NULL, \
    `lname` VARCHAR(20) NOT NULL, \
    `email` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
)');

console.log('Success: Database : ' + dbconfig.database + ' Table : ' + dbconfig.users_table)

connection.end();
