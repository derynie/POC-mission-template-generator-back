const bcrypt = require('bcrypt');
const dbConnection = require('../service/dbConnection.service');
const JWToken = require('./jwt.controller');

let accountController = {

    register: function (req, res) {
        const today = new Date();
        const user = {
            firstName: req.body.params.firstName,
            lastName: req.body.params.lastName,
            email: req.body.params.email,
            password: req.body.params.password,
            createdAt: today,
            updatedAt: today
        };

        bcrypt.hash(user.password, 10, function (err, bcryptedPassword) {
            user.password = bcryptedPassword;
            dbConnection(function (err, connection) {
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
                                "message": "user registered successfully",
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
    async me(req, res) {
        try {
            const data = await JWToken.verifyJWTToken(req.get('Authorization'))
            res.send({
                user: data.data
            })
        } catch (e) {
            res.status(400)
              .json({message: "Invalid auth token provided."})
        }
    },
    login: function(req, res) {
        const email= req.body.email;
        const password = req.body.password;

        const query = `SELECT users.id as id, CONCAT(users.firstName, ' ', users.lastName) as name, users.password as password, 
        users.email as email, users.createdAt as createdAt, users.updatedAt as updatedAt, roles.id as roleId, 
        roles.name as roleName FROM users left join roles on users.roleId = roles.id 
        WHERE Email = ?`;

        dbConnection(function(err, connection) {
            connection.query(query, email, function (error, results, fields) {
                if (error) {
                    console.log("error occurred",error);
                    res.status(401);
                    res.send({
                        "code":401,
                        "message":"error occurred"
                    })
                } else {
                    if (results.length > 0) {

                        bcrypt.compare(password, results[0].password, function(err, resPassword) {
                            // res == true

                            if (resPassword === true) {
                                res.send({
                                    code:200,
                                    message:'login successfully',
                                    user: {
                                        id: results[0].id,
                                        name: results[0].name,
                                        email: results[0].email,
                                        createdAt: results[0].createdAt,
                                        updatedAt: results[0].updatedAt
                                    },
                                    token: JWToken.createJWToken({
                                        sessionData: {
                                            id: results[0].id,
                                            name: results[0].name,
                                            email: results[0].email,
                                            roleId: results[0].roleId,
                                            roleName: results[0].roleName
                                        },
                                        maxAge: 3600
                                    })
                                });
                            } else {
                                res.status(401);
                                res.send({
                                    "code":401,
                                    "message":"Email and password does not match"
                                });
                            }
                        });
                    } else {
                        res.status(401);
                        res.send({
                            "code":401,
                            "message":"Email does not exits"
                        });
                    }
                }
            });
        });
    }
};

module.exports = accountController;