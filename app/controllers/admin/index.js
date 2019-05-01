const Projeto = require('../../models/projeto'),
    Cliente = require('../../models/cliente'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//GET NEW
exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        path: "/",
        subPath: '/'
    });
};