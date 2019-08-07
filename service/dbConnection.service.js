const mysql = require('mysql');
const { bddHost, bddUser, bddPassword, bddDatabase } = require('../utils/config');

const pool      =    mysql.createPool({
    connectionLimit : 100,
    host     : bddHost,
    user     : bddUser,
    password : bddPassword,
    database : bddDatabase,
    debug    :  false
});

const getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;
