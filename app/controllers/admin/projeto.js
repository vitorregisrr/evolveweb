const Projeto = require('../../models/projeto'),
    Cliente = require('../../models/cliente'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');


// GET ALL
exports.getAll = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    if (req.query.titulo && req.query.titulo != '') {
        query.titulo = {
            $regex: req.query.titulo,
            $options: 'i'
        }
    }

    Projeto.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Projeto.find({
                    ...query
                })
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .sort({
                    $date: 1,
                    ativo: 1
                })
                .populate('cliente')
                .then(projetos => {
                    res.render('admin/projeto/list', {
                        pageTitle: "Gerenciar projetos",
                        projetos,
                        path: "/projetos",
                        subPath: "/depoimentos/list",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        form: req.query
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET ONE
exports.getOne = (req, res, next) => {
    const cod = req.params.cod;

    Projeto.findOne({
            codigo: cod
        })
        .populate('cliente')
        .then(projeto => {
            if (!projeto) {
                return next(new Error('Projeto não encontrado'));
            }

            res.render('admin/projeto/view', {
                pageTitle: "Editar projetos",
                path: "/projetos",
                subPath: "/depoimentos/view",
                projeto,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//GET NEW
exports.getNew = (req, res, next) => {
    res.render('admin/projeto/new', {
        pageTitle: "Novo Projeto",
        path: "/projetos",
        subPath: "/projetos/new",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

//GET EDIT
exports.getEdit = (req, res, next) => {
    const cod = req.params.cod;

    Projeto.findOne({
            codigo: cod
        })
        .populate('cliente')
        .then(projeto => {
            if (!projeto) {
                return res.redirect('/admin/projetos')
            }

            res.render('admin/projeto/edit', {
                pageTitle: "Editar projeto",
                path: "/projetos",
                subPath: "/projetos/list",
                projeto,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST NEW
exports.postNew = (req, res, next) => {
    const form = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        link: req.body.link,
        ano: req.body.ano,
        cliente: req.body.cliente,
        destaque: req.body.destaque == 'on' ? true : false
    }

    if (req.body.cliente == '') {
        delete form.cliente;
    }

    cloudinary.v2.uploader.upload(req.file.path, {
            upload_preset: "projetos"
        })
        .then(image => {
            fileHelper.delete(req.file.path);

            new Projeto({
                    ...form,
                    image: image
                })
                .save()
                .then(projeto => {
                    if (req.body.novoCliente && req.body.novoCliente != '' && !req.body.proprietarioId) {
                        new Cliente({
                                nome: req.body.novoCliente
                            })
                            .save()
                            .then(cliente => {
                                projeto.cliente = cliente._id;
                                projeto.save();
                            })
                            .catch(err => console.log(err))
                    }

                    return projeto;
                })
                .then(projeto => {
                    res.redirect('/admin/projetos/images'+ projeto.codigo);
                })

                .catch(err => next(err));
        })
        .catch(err => next(JSON.stringify(err)))
};


//POST EDIT
exports.postEdit = (req, res, next) => {
    Projeto.findOne({
            _id: req.body.id
        })
        .then(projeto => {

            if (!projeto) {
                return next(new Error('Houve um erro e o seu projeto não foi encontrado, volte e tente novamente.'));
            }

            projeto.titulo = req.body.titulo;
            projeto.descricao = req.body.descricao;
            projeto.link = req.body.link;
            projeto.cliente = req.body.cliente;
            projeto.destaque = req.body.destaque == 'on' ? true : false;
            projeto.ano = req.body.ano;

            if (req.file) {
                if (projeto.imageUrl) {
                    cloudinary.uploader.destroy(projeto.imageUrl.public_id);
                }

                cloudinary.uploader.upload(req.file.path, {
                        upload_preset: "projetos"
                    })
                    .then(image => {

                        fileHelper.delete(req.file.path);
                        projeto.image = image;
                        projeto.save();
                        return res.redirect('/admin/projetos');

                    })
                    .catch(err => next(err, 500));

            } else {

                projeto.save();
                return res.redirect('/admin/projetos');
            }


            return res.redirect('/admin/projetos')

        })
        .catch(err => next(err));
}

//GET IMAGES PAGE

exports.getImages = (req, res, next) => {
    const cod = req.params.cod;

    Projeto.findOne({
            codigo: cod
        })
        .then(projeto => {
            if (!projeto) {
                return next( new Error('Projeto não encontrado'));
            }

            res.render('admin/projeto/images', {
                pageTitle: "Outras fotos",
                path: "admin/projetos",
                subPath: "admin/projetos/new",
                projeto: projeto,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
}

//ADD NEW SECONDARY IMAGE
exports.addImage = (req, res, next) => {
    const id = req.body.id;

    Projeto.findOne({
            _id: id,
        })
        .then(projeto => {
            if (!projeto) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e o objeto não foi encontrado.",
                });
            }
            cloudinary.v2.uploader.upload(req.file.path, {
                    upload_preset: 'projetos'
                })
                .then(image => {

                    fileHelper.delete(req.file.path);
                    projeto.images.push(image);

                    projeto.save()
                        .then(resul => {
                            return res.status(200).json(JSON.stringify(image));
                        })
                        .catch(err => {
                            cloudinary.uploader.destroy(image.public_id)
                            res.status(500).json({
                                "message": err
                            });
                        });
                })
                .catch(err => res.status(500).json({
                    "message": err
                }))
        })
        .catch(err => res.status(500).json({
            "message": err
        }))
}

//DELETE IMAGE
exports.deleteImage = (req, res, next) => {
    const id = req.body.id;
    const imageId = req.body.imageId;

    Projeto.findOne({
            _id: id,
        })

        .then(projeto => {
            if (!projeto) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor o projeto não foi encontrado",
                });
            }

            const oldImages = projeto.images;

            projeto.images = oldImages.filter(image => image.public_id != imageId);

            projeto.save()
                .then(resul => {
                    cloudinary.uploader.destroy(imageId)
                        .then(resul => {
                            return res.status(200).json({
                                success: true
                            });
                        })
                        .catch(err => {
                            cloudinary.uploader.destroy(image.public_id)
                            res.status(500).json({
                                'message': "Falha na hora de apagar a imagem do servidor"
                            });
                        });
                })
                .catch(err => res.status(500).json({
                    'message': "Falha na hora de salvar as alterações" + err
                }))

        })
        .catch(err => res.status(500).json({
            'message': "Falha na hora de buscar no BD" + err
        }))
}

exports.delete = (req, res, next) => {
    Projeto.findOneAndDelete({
            _id: req.body.id
        })
        .then(projeto => {

            if (!projeto) {
                next(new Error('Não encontramos o projeto para deletar.'))
            }

            // Remove main image from cloud
            if (projeto.image) {
                cloudinary.uploader.destroy(projeto.image.public_id);
            }

            // Remove all secondary images from cloud
            let destroyPromise = [];
            if (projeto.images.length > 0) {
                destroyPromise = projeto.images.map(img => cloudinary.uploader.destroy(img.public_id))
            }

            Promise.all(destroyPromise);

            res.redirect('/admin/projetos');
        })
        .catch(err => next(err, 500));
}