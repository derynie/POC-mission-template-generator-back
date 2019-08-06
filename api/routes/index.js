const express = require('express');
let router = express.Router();
const middlewareJwt = require('../../middleware/jwt.middleware');

const routerAccount = require('./account');
// const routerRole = require('./role');
const routerUser = require('./user');
const routerEnvironment = require('./environment');
// const routerDetailMission = require('./detailMission');
const routerMission = require('./mission');

router.use("/account", routerAccount);
// router.use("/role", middlewareJwt.verifyJWT_MW, routerRole);
router.use("/user", middlewareJwt.verifyJWT_MW, routerUser);
router.use("/environment", middlewareJwt.verifyJWT_MW, routerEnvironment);
// router.use("/detailMission", middlewareJwt.verifyJWT_MW, routerDetailMission);
router.use("/mission", middlewareJwt.verifyJWT_MW, routerMission);


module.exports = router;