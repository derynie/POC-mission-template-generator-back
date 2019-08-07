const dbConnection = require('../service/dbConnection.service');
const config = require('../utils/config');

function insertMany(req, res, callback) {
    dbConnection(function (err, connection) {
        const environments = req.body.environments;

        let names = [];
        let logos = [];

        for (let i = 0; i < environments.length; i++) {
            names.push(environments[i].name);
            if (!environments[i].logo || environments[i].logo === null) {
                logos.push(config.noImage)
            } else {
                logos.push(environments[i].logo);
            }
        }

        let query = `CALL addManyEnvironment('${names}', '${logos}')`;

        connection.query(query, function (error, results) {
            if (error) {
                console.log("error occurred", error);
                res.send({
                    "code": 400,
                    "message": "error occurred" + error
                })
            } else {
                callback(results);

            }
        });
    });
}

let environmentController = {

    createOne: function(req, res) {
        dbConnection(function (err, connection) {
            const environment = {
                name: req.body.name,
                logo: req.body.logo
            };

            connection.query('INSERT INTO environment SET ?', environment, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM environment WHERE id = ?', results.insertId, function (error, results) {
                        res.send({
                            "code": 200,
                            "message": "environment created successfully",
                            "environment": {
                                id: results[0].id,
                                name: results[0].name,
                                logo: results[0].logo
                            }
                        });
                    });
                }
            });
        });
    },
    getOne: function(req, res) {
        dbConnection(function (err, connection) {
            const environment = {
                id: req.query.id
            };

            connection.query('SELECT * FROM environment WHERE id = ?', environment.id, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "environment get successfully",
                        "environment": {
                            id: results[0].id,
                            name: results[0].name,
                            logo: results[0].logo
                        }
                    });
                }
            });
        });
    },
    getAll: function(req, res) {
        dbConnection(function (err, connection) {

            connection.query('SELECT DISTINCT * FROM environment', function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "environment get successfully",
                        "environments": results
                    });
                }
            });
        });
    },
    getAttachMission: function(req, res) {
        dbConnection(function (err, connection) {

            const query = 'select m.id as id, m.name as name, m.nameGroup, m.nameClient, m.validated ' +
              'from missions m left join detailMission dM on m.id = dM.missionId ' +
              'left join mission_environments me on m.id = me.missionId ' +
              'left join environment e on me.environmentId = e.id where e.id = ?';

            connection.query(query, req.query.id, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "environment get successfully",
                        "missions": results
                    });
                }
            });
        });
    },
    updateOne: function(req, res) {
        dbConnection(function (err, connection) {
            const environment = {
                id: req.body.id,
                name: req.body.name,
                logo: req.body.logo
            };

            let query = 'UPDATE environment SET ';
            let hasName = false;

            if (environment.name !== undefined) {
                hasName = true;
                query += ` name = '${environment.name}'`
            }
            if (environment.logo !== undefined) {
                if (hasName) {
                    query += ' , ';
                }
                query += ` logo = '${environment.logo}'`
            }

            query += ` WHERE id = ${environment.id}`;

            connection.query(query, function (error, result) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    connection.query('SELECT * FROM environment WHERE id = ?', environment.id, function (error, results) {
                        res.send({
                            "code": 200,
                            "message": "environment updated successfully",
                            "environment": {
                                id: results[0].id,
                                name: results[0].name,
                                logo: results[0].logo
                            }
                        });
                    });
                }
            });
        });
    },
    deleteOne: function(req, res) {
        dbConnection(function (err, connection) {
            const environment = {
                id: req.query.id
            };

            connection.query(`DELETE FROM environment WHERE id = ${environment.id}`, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "environment deleted successfully",
                        "environment": {
                            id: environment.id
                        }
                    });
                }
            });
        });
    },
    deleteOneAttachMission: function(req, res) {
        dbConnection(function(err, connection) {
           const params = {
               missionId: req.query.missionId,
               environmentId: req.query.environmentId
            };

           const query = `DELETE FROM mission_environments WHERE missionId = ${params.missionId}
           AND environmentId = ${params.environmentId}`;

           connection.query(query, function(error, results) {
              if (error) {
                  console.log("error occurred", error);
                  res.send({
                      "code": 400,
                      "message": "error occurred" + error
                  });
              } else {
                  res.send({
                      "code": 200,
                      "message": "environment attach deleted successfully",
                      "environment": {
                          id: params.environmentId
                      }
                  });
              }
           });
        });
    },
    deleteAllAttachMission: function(req, res) {
        dbConnection(function(err, connection) {
            const params = {
                environmentId: req.query.environmentId
            };

            const query = `DELETE FROM mission_environments WHERE environmentId = ${params.environmentId}`;

            connection.query(query, function(error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "environment attach all deleted successfully",
                        "environment": {
                            id: params.environmentId
                        }
                    });
                }
            });
        });
    }
};

module.exports = {
    environmentController,
    insertMany
};
