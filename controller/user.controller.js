const dbConnection = require('../service/dbConnection.service');
const bcrypt = require('bcrypt');
const config = require('../utils/config');

let userController = {
    createOne: function (req, res) {
        dbConnection(function (err, connection) {
            const today = new Date();
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: config.tempPassword,
                createdAt: today,
                updatedAt: today
            };

            bcrypt.hash(user.password, 10, function (err, bcryptedPassword) {
                user.password = bcryptedPassword;
                connection.query('INSERT INTO users SET ?', user, function (error, results) {
                    if (error) {
                        console.log("error occurred", error);
                        res.send({
                            "code": 400,
                            "message": "error occurred" + error
                        })
                    } else {
                        connection.query('SELECT * FROM users WHERE id = ?', results.insertId, function (error, results) {
                            res.send({
                                "code": 200,
                                "message": "user created successfully",
                                "user": {
                                    id: results[0].id,
                                    name: results[0].firstName + ' ' + results[0].lastName,
                                    email: results[0].email,
                                    createdAt: results[0].createdAt,
                                    updatedAt: results[0].updatedAt
                                }
                            });
                        });
                    }
                });
            });
        });
    },
    getOne: function (req, res) {
        dbConnection(function (err, connection) {
            const user = {
                id: req.body.id
            };

            connection.query('SELECT * FROM users WHERE id = ?', user.id, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "user get successfully",
                        "user": {
                            id: results[0].id,
                            name: results[0].firstName + ' ' + results[0].lastName,
                            email: results[0].email,
                            createdAt: results[0].createdAt,
                            updatedAt: results[0].updatedAt
                        }
                    });
                }
            });
        });
    },
    updateOne: function (req, res) {
        const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            updatedAt: today
        };

        dbConnection(function (err, connection) {

            let request = 'UPDATE users SET';
            request += ` updatedAt = '${today}'`;
            if (user.firstName !== undefined) {
                request += ` , firstName = '${req.body.firstName}'`;
            }
            if (user.lastName !== undefined) {
                request += ` , lastName = '${req.body.lastName}'`;
            }
            if (user.email !== undefined) {
                request += ` , email = '${req.body.email}'`;
            }
            if (user.password !== undefined) {
                bcrypt.hash(user.password, 10, function (err, bcryptedPassword) {
                    request += ` , password =  '${bcryptedPassword}'`;
                    request += ' WHERE id = ' + req.body.id;
                    connection.query(request, function (error, result) {
                        if (error) {
                            console.log("error occurred", error);
                            res.send({
                                "code": 400,
                                "message": "error occurred" + error
                            })
                        } else {
                            connection.query('SELECT * FROM users WHERE id = ?', req.body.id, function (error, results) {
                                res.send({
                                    "code": 200,
                                    "message": "user updated successfully",
                                    "user": {
                                        id: results[0].id,
                                        name: results[0].firstName + ' ' + results[0].lastName,
                                        email: results[0].email,
                                        createdAt: results[0].createdAt,
                                        updatedAt: results[0].updatedAt
                                    }
                                });
                            });
                        }
                    });
                });
            }
            else {
                request += ' WHERE id = ' + user.id;
                connection.query(request, function (error, results) {
                    if (error) {
                        console.log("error occurred", error);
                        res.send({
                            "code": 400,
                            "message": "error occurred" + error
                        })
                    } else {
                        connection.query('SELECT * FROM users WHERE id = ?', user.id, function (error, results) {
                            res.send({
                                "code": 200,
                                "message": "user updated successfully",
                                "user": {
                                    id: results[0].id,
                                    name: results[0].firstName + ' ' + results[0].lastName,
                                    email: results[0].email,
                                    createdAt: results[0].createdAt,
                                    updatedAt: results[0].updatedAt
                                }
                            });
                        });
                    }
                });
            }

        });
    },
    deleteOne: function (req, res) {
        dbConnection(function (err, connection) {
            const user = {
                id: req.query.id
            };

            connection.query(`DELETE FROM users WHERE id = ${user.id}`, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "user deleted successfully",
                        "user": {
                            id: user.id
                        }
                    });
                }
            });
        });
    },
};

module.exports = userController;
