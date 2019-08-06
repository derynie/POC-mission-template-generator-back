const dbConnection = require('../service/dbConnection.service');

let roleController = {

    createOne: function(req, res) {
        dbConnection(function (err, connection) {
            const role = {
                name: req.body.name
            };

            connection.query('INSERT INTO roles SET ?', role, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM roles WHERE id = ?', results.insertId, function (error, results) {
                        res.send({
                            "code": 200,
                            "message": "role created successfully",
                            "role": {
                                id: results[0].id,
                                name: results[0].name
                            }
                        });
                    });
                }
            });
        });
    },
    getOne: function(req, res) {
        dbConnection(function (err, connection) {
            const role = {
                id: req.query.id
            };

            connection.query('SELECT * FROM roles WHERE id = ?', role.id, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "role get successfully",
                        "role": {
                            id: results[0].id,
                            name: results[0].name
                        }
                    });
                }
            });
        });
    },
    updateOne: function(req, res) {
        dbConnection(function (err, connection) {
            const role = {
                id: req.body.id,
                name: req.body.name
            };

            connection.query(`UPDATE roles SET name = '${role.name}' WHERE id = '${role.id}'`, function (error, result) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM roles WHERE id = ?', role.id, function (error, results) {
                        res.send({
                            "code": 200,
                            "message": "role updated successfully",
                            "role": {
                                id: results[0].id,
                                name: results[0].name
                            }
                        });
                    });
                }
            });
        });
    },
    deleteOne: function(req, res) {
        dbConnection(function (err, connection) {
            const role = {
                id: req.query.id
            };

            connection.query(`DELETE FROM roles WHERE id = ${role.id}`, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "role deleted successfully",
                        "role": {
                            id: role.id
                        }
                    });
                }
            });
        });
    }
};

module.exports = roleController;