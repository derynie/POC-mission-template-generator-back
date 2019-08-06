const roleController = require('../controller/role.controller');

const roleService = {
    createOne: function(req, res, next) {
        roleController.createOne(req, res, function(result) {
            res.send(result);
        });

    },
    getOne: function(req, res, next) {
        roleController.getOne(req, res, function(result) {
            res.send(result);
        });
    },
    updateOne: function(req, res, next) {
        roleController.updateOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOne: function(req, res, next) {
        roleController.deleteOne(req, res, function(result) {
            res.send(result);
        });
    }
};

module.exports = roleService;