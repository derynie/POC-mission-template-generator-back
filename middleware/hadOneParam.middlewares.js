function hasOneParams(params) {
    return function(req, res, next) {
        let proceed = true;
        for (let i = 0; i < params.length; i++) {
            if (req.query[params[i]] !== undefined || req.body[params[i]] !== undefined) {
                proceed = true;
            }
        }
        if (proceed) {
            next();
        } else {
            res.status(403)
                .json({message: "Provide at least one good params."})
        }
    }
}

module.exports = {
    hasOneParams
};
