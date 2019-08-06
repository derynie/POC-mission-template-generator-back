const mysql = require('mysql');

const pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'quentin',
    password : 'toto1705//',
    database : 'missions',
    debug    :  false
});

const getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;