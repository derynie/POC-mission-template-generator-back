const express = require('express');
const paramsMiddlewares = require('../../middleware/params.midllewares');
const roleService = require('../../service/role.service');

let router = express.Router();


router.post('/createOne', paramsMiddlewares.hasParams(['name']), (req, res) => {
    return roleService.createOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return roleService.getOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.put('/updateOne', paramsMiddlewares.hasParams(['id', 'name']), (req, res) => {
    return roleService.updateOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return roleService.deleteOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

module.exports = router;