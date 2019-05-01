exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Error 404 - Not Found',
        path: '/404',
        robotsFollow: false,
        contact: false
    });
};

exports.get500 = (error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error 500 - Server Error',
        path: '/500',
        error: error,
        robotsFollow: false,
        contact: false
    });
};