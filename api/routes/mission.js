const express = require('express');
const paramsMiddlewares = require('../../middleware/params.midllewares');
const hasOneParamsMiddlewares = require('../../middleware/hadOneParam.middlewares');
const missionService = require('../../service/mission.service');

let router = express.Router();


router.post('/createOne', hasOneParamsMiddlewares.hasOneParams(
    ['name', 'image', 'logoGroup', 'logoClient', 'context', 'livrable', 'atecnaPlus', 'category', 'type',
    'duration', 'teamSize', 'location', 'environments']), paramsMiddlewares.hasParams(['userId']) , (req, res) => {
    return missionService.createOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return missionService.getOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/galery', paramsMiddlewares.hasParams(['userId', 'role', 'nbPerPage', 'lastId']), (req, res) => {
    return missionService.galery(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

router.get('/getDistinctNameGroup', paramsMiddlewares.hasParams(['userId', 'role']), (req, res) => {
    return missionService.getDistinctNameGroup(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

router.get('/getDistinctNameClient', paramsMiddlewares.hasParams(['userId', 'role']), (req, res) => {
    return missionService.getDistinctNameClient(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

router.get('/getDistinctName', paramsMiddlewares.hasParams(['userId', 'role']), (req, res) => {
    return missionService.getDistinctName(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

router.put('/updateOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return missionService.updateOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return missionService.deleteOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

module.exports = router;