const environmentController = require('../controller/environment.controller');

const environmentService = {
    createOne: function(req, res, next) {
        environmentController.environmentController.createOne(req, res, function(result) {
            res.send(result);
        });

    },
    getOne: function(req, res, next) {
        environmentController.environmentController.getOne(req, res, function(result) {
            res.send(result);
        });
    },
    getAll: function(req, res, next) {
        environmentController.environmentController.getAll(req, res, function(result) {
            res.send(result);
        });
    },
    getAttachMission: function(req, res, next) {
        environmentController.environmentController.getAttachMission(req, res, function(result) {
            res.send(result);
        });
    },
    updateOne: function(req, res, next) {
        environmentController.environmentController.updateOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOne: function(req, res, next) {
        environmentController.environmentController.deleteOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOneAttachMission: function (req, res) {
        environmentController.environmentController.deleteOneAttachMission(req, res, function(result) {
            res.send(result);
        });
    },
    deleteAllAttachMission: function (req, res) {
        environmentController.environmentController.deleteAllAttachMission(req, res, function(result) {
            res.send(result);
        });
    }
};

module.exports = environmentService;