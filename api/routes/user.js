const express = require('express');
const paramsMiddlewares = require('../../middleware/params.midllewares');
const userService = require('../../service/user.service');

let router = express.Router();


router.post('/createOne', paramsMiddlewares.hasParams(['firstName', 'lastName', 'email']), (req, res) => {
    return userService.createOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return userService.getOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.put('/updateOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return userService.updateOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return userService.deleteOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

module.exports = router;