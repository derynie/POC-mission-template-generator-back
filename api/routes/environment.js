const express = require('express');
const paramsMiddlewares = require('../../middleware/params.midllewares');
const environmentService = require('../../service/environment.service');

let router = express.Router();


router.post('/createOne', paramsMiddlewares.hasParams(['name', 'logo']), (req, res) => {
    return environmentService.createOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return environmentService.getOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getAll', (req, res) => {
    return environmentService.getAll(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getAttachMission', (req, res) => {
    return environmentService.getAttachMission(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.put('/updateOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return environmentService.updateOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return environmentService.deleteOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOneAttachMission', paramsMiddlewares.hasParams(['missionId', 'environmentId']), (req, res) => {
    return environmentService.deleteOneAttachMission(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

router.delete('/deleteAllAttachMission', paramsMiddlewares.hasParams(['environmentId']), (req, res) => {
    return environmentService.deleteAllAttachMission(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

module.exports = router;