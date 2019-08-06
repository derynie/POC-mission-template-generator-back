const detailMissionController = require('../controller/detailMission.controller');

const detailMissionService = {
    createOne: function(req, res, next) {
        detailMissionController.createOne(req, res, function(result) {
            res.send(result);
        });

    },
    getOne: function(req, res, next) {
        detailMissionController.getOne(req, res, function(result) {
            res.send(result);
        });
    },
    updateOne: function(req, res, next) {
        detailMissionController.updateOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOne: function(req, res, next) {
        detailMissionController.deleteOne(req, res, function(result) {
            res.send(result);
        });
    }
};

module.exports = detailMissionService;