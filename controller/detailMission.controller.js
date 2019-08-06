const dbConnection = require('../service/dbConnection.service');

let detailMissionController = {

    createOne: function(req, res, callback) {
        dbConnection(function (err, connection) {
            const today = new Date();
            const detailMission = {
                missionId: req.body.missionId,
                category: req.body.category,
                type: req.body.type,
                duration: req.body.duration,
                teamSize: req.body.teamSize,
                location: req.body.location,
                createdAt: today,
                updatedAt: today
            };

            connection.query('INSERT INTO detailMission SET ?', detailMission, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM detailMission WHERE id = ?', results.insertId, function (error, results) {
                        callback({"detailMission": {
                                id: results[0].id,
                                missionId: results[0].missionId,
                                category: results[0].category,
                                type: results[0].type,
                                duration: results[0].duration,
                                teamSize: results[0].teamSize,
                                location: results[0].location,
                                createdAt: results[0].createdAt,
                                updatedAt: results[0].updatedAt
                        }});
                    });
                }
            });
        });
    },
    getOne: function(req, res) {
        dbConnection(function (err, connection) {
            const detailMission = {
                id: req.query.id
            };

            connection.query('SELECT * FROM detailMission WHERE id = ?', detailMission.id, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "detailMission get successfully",
                        "detailMission": {
                            id: results[0].id,
                            missionId: results[0].missionId,
                            category: results[0].category,
                            type: results[0].type,
                            duration: results[0].duration,
                            teamSize: results[0].teamSize,
                            location: results[0].location,
                            createdAt: results[0].createdAt,
                            updatedAt: results[0].updatedAt
                        }
                    });
                }
            });
        });
    },
    updateOne: function(req, res) {
        dbConnection(function (err, connection) {
            const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const detailMission = {
                id: req.body.id,
                category: req.body.category,
                type: req.body.type,
                duration: req.body.duration,
                teamSize: req.body.teamSize,
                location: req.body.location,
                updatedAt: today
            };

            let request = 'UPDATE detailMission SET ';
            request += ` updatedAt = '${today}'`;
            if (detailMission.category !== undefined) {
                request += ` , category = '${detailMission.category}'`;
            }
            if (detailMission.type !== undefined) {
                request += ` , type = '${detailMission.type}'`
            }
            if (detailMission.duration !== undefined) {
                request += ` , duration = '${detailMission.duration}'`
            }
            if (detailMission.teamSize !== undefined) {
                request += ` , teamSize = '${detailMission.teamSize}'`
            }
            if (detailMission.location !== undefined) {
                request += ` , location = '${detailMission.location}'`
            }

            connection.query(request, function (error, result) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM detailMission WHERE id = ?', detailMission.id, function (error, results) {
                        res.send({
                            "code": 200,
                            "message": "detailMission updated successfully",
                            "detailMission": {
                                id: results[0].id,
                                missionId: results[0].missionId,
                                category: results[0].category,
                                type: results[0].type,
                                duration: results[0].duration,
                                teamSize: results[0].teamSize,
                                location: results[0].location,
                                createdAt: results[0].createdAt,
                                updatedAt: results[0].updatedAt
                            }
                        });
                    });
                }
            });
        });
    },
    deleteOne: function(req, res) {
        dbConnection(function (err, connection) {
            const detailMission = {
                id: req.query.id
            };

            connection.query(`DELETE FROM detailMission WHERE id = ${detailMission.id}`, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "detailMission deleted successfully",
                        "detailMission": {
                            id: detailMission.id
                        }
                    });
                }
            });
        });
    }
};

module.exports = detailMissionController;