const JWToken = require('../controller/jwt.controller');

function verifyJWT_MW(req, res, next)
{
    let token = (req.method === 'GET' || req.method === 'DELETE') ? req.query.token : req.body.token;

    JWToken.verifyJWTToken(token)
        .then((decodedToken) =>
        {
            req.user = decodedToken.data;
            next()
        })
        .catch((err) =>
        {
            res.status(400)
                .json({message: "Invalid auth token provided."})
        })
}

module.exports = {
    verifyJWT_MW
};