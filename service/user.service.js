const userController = require('../controller/user.controller');

const userService = {
    createOne: function(req, res, next) {
        userController.createOne(req, res, function(result) {
            res.send(result);
        });

    },
    getOne: function(req, res, next) {
        userController.getOne(req, res, function(result) {
            res.send(result);
        });
    },
    updateOne: function(req, res, next) {
        userController.updateOne(req, res, function(result) {
            res.send(result);
        });
    },
    deleteOne: function(req, res, next) {
        userController.deleteOne(req, res, function(result) {
            res.send(result);
        });
    }
};

module.exports = userService;