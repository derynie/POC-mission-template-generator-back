
function hasParams(params) {
    return function(req, res, next) {
        let proceed = true;
        for (let i = 0; i < params.length; i++) {
            if (req.query[params[i]] === undefined && req.body[params[i]] === undefined) {
                proceed = false;
            }
        }
        if (proceed) {
            next();
        } else {
            res.status(403)
                .json({message: "Bad param(s) provided."})
        }
    }
}

module.exports = {
    hasParams
};