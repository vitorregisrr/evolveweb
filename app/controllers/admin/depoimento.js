const Cliente = require('../../models/cliente'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//GET ALL
exports.getAll = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    Depoimento.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Depoimento.find({
                    ...query
                })
                .populate('cliente')
                .then(deps => {
                    res.render('admin/depoimento/list', {
                        pageTitle: "Gerenciar Depoimentos",
                        depoimentos: deps,
                        path: "/depoimentos",
                        subPath: "/depoimentos/list",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};


//GET ONE
exports.getOne = (req, res, next) => {
    const id = req.params.id;
    Depoimento.find({
            _id: id
        })
        .then(dep => {
            if (!dep) {
                return new Error('Depoimento não encontrado');
            }
            res.render('admin/depoimento/view', {
                pageTitle: "Ver Depoimento",
                path: "/depoimentos",
                subPath: "/depoimentos/view",
                errorMessage: [],
                form: false,
                depoimento: dep
            });
        })
        .catch(err => next(err));
};


//GET NEW
exports.getNew = (req, res, next) => {
    res.render('admin/depoimento/new', {
        pageTitle: "Novo Depoimento",
        path: "admin/depoimento/depoimentos",
        subPath: "/depoimentos/new",
        errorMessage: [],
        form: false
    });
};

//POST NEW
exports.postNew = (req, res, next) => {
    Cliente.findOne({
            _id: req.body.cliente
        })
        .then(cliente => {
            new Depoimento({
                    titulo: req.body.titulo,
                    descricao: req.body.descricao,
                    destaque: req.body.destaque == 'on' ? true : false,
                    cliente: req.body.cliente
                })
                .save()
                .then(depoimento => {
                    cliente.depoimento = depoimento;
                    cliente.save();
                })
                .then(resul => {
                    res.redirect('/admin/depoimentos')
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET EDIT
exports.getEdit = (req, res, next) => {
    const id = req.params.id;

    Depoimento.findOne({
            _id: id
        })
        .populate('cliente')
        .then(dep => {
            if (!dep) {
                return res.redirect('/admin/depoimentos')
            }
            res.render('admin/depoimento/edit', {
                pageTitle: "Editar Depoimento",
                path: "/admin/depoimentos",
                subPath: "/depoimentos/list",
                depoimento: dep,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT
exports.postEdit = (req, res, next) => {
    const form = {
        titulo: req.body.titulo,
        cliente: req.body.cliente,
        descricao: req.body.descricao,
        destaque: req.body.destaque == 'on' ? true : false,
        id: req.body.id,
    }

    Depoimento.findOne({
            _id: form.id
        })
        .then(dep => {

            if (!dep) {
                return next(new Error('Houve um erro e o seu não foi encontrado, volte e tente novamente.'));
            }

            dep.cliente = form.cliente;
            dep.descricao = form.descricao;
            dep.destaque = form.destaque;
            dep.titulo = form.titulo;

            if (req.file) {

                if (dep.imageUrl) {
                    cloudinary.uploader.destroy(dep.imageUrl.public_id);
                }

                fileHelper.compressImage(req.file)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath)
                            .then(image => {

                                fileHelper.delete(newPath);
                                dep.imageUrl = image;
                                dep.save();
                                return res.redirect('/admin/depoimentos');
                            })
                    })
                    .catch(err => next(err));
            } else {

                dep.save();
                return res.redirect('/admin/depoimentos');
            }

        })
        .catch(err => next(err));
}

//DELETE
exports.delete = (req, res, next) => {
    const id = req.body.id;

    Depoimento.findOneAndDelete({
            _id: id
        })
        .then(depoimento => {
            if (!depoimento) {
                return next(new Error('depoimento não encontrado para apagar.'))
            }

            res.redirect('/admin/depoimentos')
        })
        .catch(err => next(err, 500));
};