const Noticia = require('../../models/noticia'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//GET ALL
exports.getAll = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    Noticia.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Noticia.find({
                    ...query
                })
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .sort({
                    $date: 1,
                    ativo: 1
                })
                .populate('autor')
                .then(noticias => {
                    res.render('admin/noticia/list', {
                        pageTitle: "Gerenciar noticias",
                        noticias: noticias,
                        path: "/noticias",
                        subPath: "/noticias/list",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET ONE
exports.getOne = (req, res, next) => {
    const id = req.params.id;
    Noticia.find({
            _id: id
        })
        .then(noticia => {
            if (!noticia) {
                return new Error('Noticia não encontrada');
            }
            res.render('admin/noticia/view', {
                pageTitle: "Dados Notícia",
                path: "/noticias",
                subPath: "/noticias/view",
                errorMessage: [],
                form: false,
                noticia
            });
        })
        .catch(err => next(err));
};

//GET NEW
exports.getNew = (req, res, next) => {
    res.render('admin/noticia/new', {
        pageTitle: "Novo noticia",
        path: "/noticias",
        subPath: "/noticias/new",
        errorMessage: [],
        form: false
    });
};

//POST NEW
exports.postNew = (req, res, next) => {
    cloudinary.v2.uploader.upload(req.file.path, {
            upload_preset: "noticias"
        })
        .then(image => {

            fileHelper.delete(req.file.path);
            new Noticia({
                    ...req.body,
                    imageUrl: image,
                })
                .save()
                .then(resul => {
                    res.redirect('/admin/noticias');
                })
                .catch(err => {
                    fileHelper.delete(req.file.path);
                    next(err);
                })
        })
        .catch(err => next(err, 500))
};

//GET EDIT
exports.getEdit = (req, res, next) => {
    const id = req.params.id;

    Noticia.findOne({
            _id: id
        })
        .then(dep => {
            if (!dep) {
                return res.redirect('/admin/noticias')
            }
            res.render('admin/noticia/edit', {
                pageTitle: "Editar noticia",
                path: "/noticias",
                subPath: "/noticias/list",
                dep: dep,
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
        id: req.body.id,
    }

    Noticia.findOne({
            _id: form.id
        })
        .then(noticia => {

            if (!noticia) {
                return next(new Error('Houve um erro e o seu não foi encontrado, volte e tente novamente.'));
            }

            noticia.autor = form.autor;
            noticia.titulo = form.titulo;
            noticia.tags = form.tags;
            noticia.conteudo = form.conteudo;

            if (req.file) {

                if (noticia.image) {
                    cloudinary.uploader.destroy(noticia.image.public_id);
                }

                cloudinary.uploader.upload(req.file.path, {
                        upload_preset: "noticias"
                    })
                    .then(image => {

                        fileHelper.delete(req.file.path);
                        noticia.image = image;
                        noticia.save();
                        return res.redirect('/admin/noticias');
                    })
                    .catch(err => next(err, 500));

            } else {

                noticia.save();
                return res.redirect('/admin/noticias');
            }

        })
        .catch(err => next(err));
}

//DELETE noticia
exports.delete = (req, res, next) => {
    const id = req.params.id;

    Noticia.findOneAndDelete({
            _id: id
        })

        .then(noticia => {
            if (!noticia) {
                return res.status(500).json({
                    "message": "Error",
                });
            }

            return res.status(200).json({
                "message": "Success"
            });

        })

        .catch(err => {
            res.status(500).json({
                "message": "Error",
            });
        });
};