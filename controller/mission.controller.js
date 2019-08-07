const dbConnection = require('../service/dbConnection.service');
const detailMissionController = require('./detailMission.controller');
const environmentController = require('./environment.controller');
const nodemailer = require('nodemailer');
const { mailAuthentificationEmail } = require('../utils/config');
const { mailAuthentificationPassword } = require('../utils/config');
const { mailsTo } = require('../utils/config');

function continueCreateOne(req, res, callback) {
    const mission = {
        userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        logoGroup: req.body.logoGroup,
        logoClient: req.body.logoClient,
        nameGroup: req.body.nameGroup,
        nameClient: req.body.nameClient,
        webSite: req.body.webSite,
        context: req.body.context,
        livrable: req.body.livrable,
        atecnaPlus: req.body.atecnaPlus,
        category: req.body.category,
        type: req.body.type,
        duration: req.body.duration,
        teamSize: req.body.teamSize,
        location: req.body.location,
        environments: req.body.environments
    };

    /*if (req.body.environments) {
        console.log('req.body.environments = ', req.body.environments);
        mission.environments = JSON.parse(req.body.environments)
    }*/
    if (mission.environments && mission.environments.length > 0) {
        let createEnvironments = [];
        let idToSet = [];
        for (let i = 0; i < mission.environments.length; i++) {
            if (!mission.environments[i].id) {
                createEnvironments.push(mission.environments[i]);
                idToSet.push(-1);
            } else {
                idToSet.push(mission.environments[i].id);
            }
        }

        if (createEnvironments.length > 0) {
            req.body.environments = createEnvironments;
            environmentController.insertMany(req, res, function(results) {
                let count = results[0][0].id;
               for (let i = 0; i < idToSet.length; i++) {
                   if (idToSet[i] === -1) {
                       idToSet[i] = count;
                       count += 1;
                   }
               }

                mission.environmentsId = idToSet;
                req.body = mission;
                finishCreateMission(req, res);
            });
        } else {
            mission.environmentsId = idToSet;
            req.body = mission;
            finishCreateMission(req, res);
        }
    } else {
        req.body = mission;
        finishCreateMission(req, res);
    }
}

function finishCreateMission(req, res) {

    const today = new Date();
    let mission = {
        userId: req.body.userId,
        createdAt: today,
        updatedAt: today,
    };

    if (req.body.name) {
        mission.name = req.body.name;
    }

    if (req.body.image) {
        mission.image = req.body.image;
    }

    if (req.body.logoGroup) {
        mission.logoGroup = req.body.logoGroup;
    }

    if (req.body.logoClient) {
        mission.logoClient = req.body.logoClient;
    }

    if (req.body.nameGroup) {
        mission.nameGroup = req.body.nameGroup;
    }

    if (req.body.nameClient) {
        mission.nameClient = req.body.nameClient;
    }

    if (req.body.webSite) {
        mission.webSite = req.body.webSite;
    }

    if (req.body.context) {
        mission.context = req.body.context;
    }

    if (req.body.livrable) {
        mission.livrable = req.body.livrable;
    }
    if (req.body.atecnaPlus) {
        mission.atecnaPlus = req.body.atecnaPlus;
    }

    dbConnection(function (err, connection) {

        connection.query('INSERT INTO missions SET ?', mission, function (error, results) {
            if (error) {
                console.log("error occurred", error);
                res.send({
                    "code": 400,
                    "message": "error occurred" + error
                })
            } else {

                let send = {
                    body: {
                        missionId: results.insertId
                    }
                };

                if (req.body.category) {
                    send.body.category = req.body.category
                }

                if (req.body.type) {
                    send.body.type = req.body.type
                }

                if (req.body.duration) {
                    send.body.duration = req.body.duration
                }

                if (req.body.teamSize) {
                    send.body.teamSize = req.body.teamSize
                }

                if (req.body.location) {
                    send.body.location = req.body.location
                }

                detailMissionController.createOne(send, res, function(resultsDet) {
                    connection.query('SELECT * FROM missions WHERE id = ?', results.insertId, function (error, resultsMission) {

                        mission = {
                            missionId: resultsMission[0].id,
                            userId: req.body.userId,
                            name: resultsMission[0].name,
                            image: resultsMission[0].image,
                            logoGroup: resultsMission[0].logoGroup,
                            logoClient: resultsMission[0].logoClient,
                            nameGroup: resultsMission[0].nameGroup,
                            nameClient: resultsMission[0].nameClient,
                            webSite: resultsMission[0].webSite,
                            context: resultsMission[0].context,
                            livrable: resultsMission[0].livrable,
                            atecnaPlus: resultsMission[0].atecnaPlus,
                            detailMissionId: resultsMission[0].detailMissionId,
                            category: resultsMission[0].category,
                            type: resultsDet.detailMission.type,
                            duration: resultsDet.detailMission.duration,
                            teamSize: resultsDet.detailMission.teamSize,
                            location: resultsDet.detailMission.location,
                            environmentsId: req.body.environmentsId
                        };

                        req.body = mission;
                        if (req.body.environmentsId) {
                            mission.environmentsId = req.body.environmentsId;
                            linkToEnvironment(req, res);
                        } else {
                            sendMailAfterCreate(req, res);
                            res.send({
                                "code": 200,
                                "message": "mission created successfully",
                                "mission": mission
                            });
                        }
                    });

                });
            }
        });
    });
}

function sendMailAfterCreate(req, res) {
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: mailAuthentificationEmail,
            pass: mailAuthentificationPassword
        }
    });

    const text = 'The collaborator ' + req.body.name + ' as created a new mission.';

    const mailOptions = {
        from: mailAuthentificationEmail,
        to: mailsTo,
        subject: 'A new mission has been created',
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function linkToEnvironment(req, res) {
    dbConnection(function (err, connection) {

        let query = `CALL addManyMissionEnvironments('${req.body.missionId}', '${req.body.environmentsId}')`;

        connection.query(query, function (error, resultsMTE) {
            if (error) {
                console.log("error occurred", error);
                res.send({
                    "code": 400,
                    "message": "error occurred" + error
                })
            } else {
                req.query = {};
                req.query.id = req.body.missionId;
                sendMailAfterCreate(req, res);
                missionController.getOne(req, res);

            }
        });
    });
}

function updateMission(req, res) {
    const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = `UPDATE missions SET `;

    query += ` updatedAt = '${today}'`;

    if (req.body.userId) {
        query += ` , userId = '${req.body.userId}'`;
    }

    if (req.body.name) {
        query += ` , name = '${req.body.name}'`;
    }

    if (req.body.image) {
        query += ` , image = '${req.body.image}'`;
    }

    if (req.body.logoGroup) {
        query += ` , logoGroup = '${req.body.logoGroup}'`;
    }

    if (req.body.logoClient) {
        query += ` , logoClient = '${req.body.logoClient}'`;
    }

    if (req.body.nameGroup) {
        query += ` , nameGroup = '${req.body.nameGroup}'`;
    }

    if (req.body.nameClient) {
        query += ` , nameClient = '${req.body.nameClient}'`;
    }

    if (req.body.context) {
        query += ` , context = '${req.body.context}'`;
    }

    if (req.body.livrable) {
        query += ` , livrable = '${req.body.livrable}'`;
    }

    if (req.body.atecnaPlus) {
        query += ` , atecnaPlus = '${req.body.atecnaPlus}'`;
    }

    query += ` WHERE id = ${req.body.missionId}`;

    dbConnection(function (err, connection) {

        connection.query(query, function (error, result) {
            if (error) {
                console.log("error occurred", error);
                res.send({
                    "code": 400,
                    "message": "error occurred" + error
                })
            } else {
                if (req.body.category || req.body.type || req.body.duration ||
                    req.body.teamSize || req.body.location) {
                    updateDetailMission(req, res);
                } /*else if (req.body.environments) {
                    updateMissionEnvironment(req, res);
                }*/ else {
                    req.query = {};
                    req.query.id = req.body.missionId;
                    missionController.getOne(req, res);
                }
            }
        });
    });
}

function updateDetailMission(req, res) {
    const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = `UPDATE detailMission SET `;

    query += ` updatedAt = '${today}'`;

    if (req.body.category) {
        query += ` , category = '${req.body.category}'`;
    }

    if (req.body.type) {
        query += ` , type = '${req.body.type}'`;
    }

    if (req.body.duration) {
        query += ` , duration = '${req.body.duration}'`;
    }

    if (req.body.teamSize) {
        query += ` , teamSize = '${req.body.teamSize}'`;
    }

    if (req.body.location) {
        query += ` , location = '${req.body.location}'`;
    }

    query += ` WHERE missionId = ${req.body.missionId}`;

    dbConnection(function (err, connection) {

        connection.query(query, function (error, result) {
            if (error) {
                console.log("error occurred", error);
                res.send({
                    "code": 400,
                    "message": "error occurred" + error
                })
            } else {
               /*if (req.body.environments) {
                    updateMissionEnvironment(req, res);
                } else {
                    req.query = {};
                    req.query.id = req.body.missionId;
                    missionController.getOne(req, res);
                }*/
                req.query = {};
                req.query.id = req.body.missionId;
                missionController.getOne(req, res);
            }
        });
    });
}

/*function updateMissionEnvironment(req, res) {
    let environments = JSON.parse(req.body.environments);

    if (environments.add) {
        let createEnvironments = [];
        let idToSet = [];
        for (let i = 0; i < environments.add.length; i++) {
            if (!environments.add[i].id) {
                createEnvironments.push(environments.add[i]);
                idToSet.push(-1);
            } else {
                idToSet.push(environments.add[i].id);
            }
        }
        if (createEnvironments.length > 0) {
            req.body.environments = createEnvironments;
            environmentController.insertMany(req, res, function(results) {
                let count = results[0][0].id;
                for (let i = 0; i < idToSet.length; i++) {
                    if (idToSet[i] === -1) {
                        idToSet[i] = count;
                        count += 1;
                    }
                }
                // ici pour la suite
            });
        }
    }

    if (environments.modify) {

    }

    if (environments.delete) {

    }
}*/

let missionController = {

    createOne: function(req, res) {
        continueCreateOne(req, res);
    },
    getOne: function(req, res) {
        dbConnection(function (err, connection) {

            const query = `CALL getMission('${req.query.id}')`;

            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    let mission = {
                        missionId: results[0][0].missionId,
                        userId: results[0][0].userId,
                        name: results[0][0].name,
                        image: results[0][0].image,
                        logoGroup: results[0][0].logoGroup,
                        logoClient: results[0][0].logoClient,
                        nameGroup: results[0][0].nameGroup,
                        nameClient: results[0][0].nameClient,
                        detailMissionId: results[0][0].detailMissionId,
                        webSite: results[0][0].webSite,
                        context: results[0][0].context,
                        livrable: results[0][0].livrable,
                        atecnaPlus: results[0][0].atecnaPlus,
                        createdAt: results[0][0].createdAt,
                        updatedAt: results[0][0].updatedAt,
                        category: results[0][0].category,
                        type: results[0][0].type,
                        duration: results[0][0].duration,
                        teamSize: results[0][0].teamSize,
                        location: results[0][0].location
                    };

                    if (results[0][0].environmentsId) {
                        let ids = results[0][0].environmentsId.split(',');
                        let names = results[0][0].environmentsName.split(',');
                        let logos = results[0][0].environmentsLogo.split(',');
                        mission.environments = [];
                        while (ids.length > 0) {
                            mission.environments.push({
                                id: ids[0],
                                name: names[0],
                                logo: logos[0]
                            });
                            ids.shift();
                            names.shift();
                            logos.shift();
                        }
                    }

                    res.send({
                        "code": 200,
                        "message": "mission get successfully",
                        "mission": mission
                    });
                }
            });
        });
    },
    galery: function(req, res) {
        dbConnection(function (err, connection) {
            const params = {
                nameGroup: req.query.nameGroup ? req.query.nameGroup : null,
                nameClient: req.query.nameClient ? req.query.nameClient : null,
                name: req.query.name ? req.query.name : null,
                userId: req.query.userId ? req.query.userId : -1,
                validated: req.query.validated ? req.query.validated : -1,
                role: req.query.role,
                nbPerPage: req.query.nbPerPage,
                lastId: req.query.lastId,
            };

            let query = 'CALL getGallery(';

            if (params.nameGroup === null) {
                query += `${params.nameGroup}, `;
            } else {
                query += `'${params.nameGroup}', `;
            }

            if (params.nameClient === null) {
                query += `${params.nameClient}, `;
            } else {
                query += `'${params.nameClient}', `;
            }

            query += `${params.userId}, `;
            query += `${params.validated}, `;
            query += `'${params.role}', `;

            if (params.name === null) {
                query += `${params.name}, `;
            } else {
                query += `'${params.name}', `;
            }

            query += `${params.nbPerPage}, ${params.lastId})`;

            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    results.map(elem => {

                    });
                    for (let y = 0; y < results.length; y++) {
                        if (results[y].length > 0) {
                            for (let i = 0; i < results[y].length; i++) {
                                if (results[y][i].nameGroup && results[y][i].nameClient) {
                                    results[y][i].name = results[y][i].nameGroup + ' ' + results[y][i].nameClient;
                                } else if (results[y][i].nameGroup && !results[y][i].nameClient) {
                                    results[y][i].name = results[y][i].nameGroup;
                                } else if (!results[y][i].nameGroup && results[y][i].nameClient) {
                                    results[y][i].name = results[y][i].nameClient;
                                } else {
                                    results[y][i].name = '';
                                }
                            }
                        }
                    }
                    res.send({
                        "code": 200,
                        "message": "mission get successfully",
                        "mission": results
                    });
                }
            });
        });
    },
    getDistinctNameGroup: function(req, res) {
        let query = '';
        if (req.query.role === 'USR') {
            query += `select DISTINCT nameGroup from missions m where m.userId = ${req.query.userId}`;
        }
        if (req.query.role === 'ADM') {
            query += `select DISTINCT nameGroup from missions m`;
        }

        dbConnection(function (err, connection) {
            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "mission get successfully",
                        "nameGroups": results
                    });
                }
            });
        });
    },
    getDistinctNameClient: function(req, res) {
        let query = '';
        if (req.query.role === 'USR') {
            query += `select DISTINCT nameClient from missions m where m.userId = ${req.query.userId}`;
        }
        if (req.query.role === 'ADM') {
            query += `select DISTINCT nameClient from missions m`;
        }

        dbConnection(function (err, connection) {
            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "mission get successfully",
                        "nameClients": results
                    });
                }
            });
        });
    },
    getDistinctName: function(req, res) {
        let query = '';
        if (req.query.role === 'ADM') {
            query += `select DISTINCT CONCAT(u.firstName, ' ', u.lastName) as name from users u`;
        }

        dbConnection(function (err, connection) {
            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "mission get successfully",
                        "names": results
                    });
                }
            });
        });
    },
    updateOne: function(req, res) {

        let mission = {
            missionId: req.body.id,
            userId: req.body.userId,
            name: req.body.name,
            image: req.body.image,
            logoGroup: req.body.logoGroup,
            logoClient: req.body.logoClient,
            nameGroup: req.body.nameGroup,
            nameClient: req.body.nameClient,
            detailMissionId: req.body.detailMissionId,
            webSite: req.body.webSite,
            context: req.body.context,
            livrable: req.body.livrable,
            atecnaPlus: req.body.atecnaPlus,
            createdAt: req.body.createdAt,
            updatedAt: req.body.updatedAt,
            category: req.body.category,
            type: req.body.type,
            duration: req.body.duration,
            teamSize: req.body.teamSize,
            location: req.body.location,
            environments: req.body.location
        };

        req.body = mission;

        if (mission.missionId && (mission.userId || mission.name || mission.image || mission.logoGroup ||
            mission.logoClient || mission.nameGroup || mission.nameClient || mission.webSite ||
            mission.context || mission.livrable || mission.atecnaPlus)) {
            updateMission(req, res);
        } else if (mission.category || mission.type || mission.duration || mission.teamSize ||
            mission.location) {
            updateDetailMission(req, res);
        } /*else if (mission.environments) {
            updateMissionEnvironment(req, res);
        }*/
    },
    deleteOne: function(req, res) {
        dbConnection(function (err, connection) {
            const mission = {
                id: req.query.id
            };

            let query = `DELETE FROM missions WHERE id = ${mission.id}`;

            connection.query(query, function (error, results) {
                if (error) {
                    console.log("error occurred", error);
                    res.send({
                        "code": 400,
                        "message": "error occurred" + error
                    })
                } else {
                    res.send({
                        "code": 200,
                        "message": "mission deleted successfully",
                        "mission": {
                            id: mission.id
                        }
                    });
                }
            });
        });
    }
};

module.exports = missionController;
