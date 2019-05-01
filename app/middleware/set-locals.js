module.exports = (req, res, next) => {
    //setting locals
    res.locals.user = req.user ? req.user : null;
    res.locals.csrfToken = req.csrfToken();
    next();
};