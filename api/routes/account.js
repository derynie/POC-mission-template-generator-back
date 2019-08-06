const express = require('express');

const  accountService = require('../../service/account.service');

let router = express.Router();


router.post('/register', (req, res) => {
    return accountService.register(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    });
});

router.post('/login', (req, res) => {
   return accountService.login(req, res, function(err, dist) {
       if (err) {
           res.send(err);
       }
       res.json(dist);
   });
});

router.get('/me', (req, res) => {
    return  accountService.me(req, res, function(err, dist) {
        if (err) {
            res.send(err);
        }
        res.json(dist);
    })
});

module.exports = router;