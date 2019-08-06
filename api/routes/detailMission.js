const express = require('express');
const paramsMiddlewares = require('../../middleware/params.midllewares');
const detailMissionService = require('../../service/detailMission.service');

let router = express.Router();


router.post('/createOne', (req, res) => {
    return detailMissionService.createOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.get('/getOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return detailMissionService.getOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.put('/updateOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return detailMissionService.updateOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.delete('/deleteOne', paramsMiddlewares.hasParams(['id']), (req, res) => {
    return detailMissionService.deleteOne(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

module.exports = router;