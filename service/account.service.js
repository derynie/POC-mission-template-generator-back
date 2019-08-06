const accountController = require('../controller/account.controller');

const accountService = {
    register: function(req, res, next) {
        accountController.register(req, res, function(result) {
            res.send(result);
            });

    },
    login: function(req, res, next) {
        accountController.login(req, res, function(result) {
           res.send(result);
        });
    },
    me: function(req, res, next) {
        accountController.me(req, res, function(results) {
            res.send(results);
        });
    }
};

module.exports = accountService;