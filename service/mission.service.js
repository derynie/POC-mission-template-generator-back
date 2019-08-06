const missionController = require('../controller/mission.controller');

const missionService = {
    createOne: function(req, res, next) {
        missionController.createOne(req, res, function(result) {
            res.send(result);
        });

    },
    getOne: function(req, res, next) {
        missionController.getOne(req, res, function(result) {
            res.send(result);
        });
    },
    galery: function(req, res, next) {
        missionController.galery(req, res, function(results) {
            res.send(results);
        })
    },
    getDistinctNameGroup: function(req, res, next) {
        missionController.getDistinctNameGroup(req, res, function(results) {
            res.send(results);
        })
    },
    getDistinctNameClient: function(req, res, next) {
        missionController.getDistinctNameClient(req, res, function(results) {
            res.send(results);
        })
    },
    getDistinctName: function(req, res, next) {
        missionController.getDistinctName(req, res, function(results) {
            res.send(results);
        })
    },
    updateOne: function(req, res, next) {
        missionController.updateOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOne: function(req, res, next) {
        missionController.deleteOne(req, res, function(result) {
            res.send(result);
        });
    }
};

module.exports = missionService;