const Cliente = require('../../models/cliente'),
    Depoimento = require('../../models/depoimento'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//DEPOIMENTO
exports.getAll = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};
    Cliente.find({
            ...query
        })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Cliente.find({
                    ...query
                })
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(clientes => {
                    res.render('admin/cliente/list', {
                        pageTitle: "Gerenciar Depoimentos",
                        clientes: clientes,
                        path: "/clientes",
                        subPath: "/clientes/list",
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
    Cliente.find({
            _id: id
        })
        .then(cli => {
            if (!cli) {
                return new Error('Cliente não encontrado');
            }
            res.render('admin/cliente/view', {
                pageTitle: "Dados Cliente",
                path: "/clientes",
                subPath: "/clientes/view",
                errorMessage: [],
                form: false,
                cliente: cli
            });
        })
        .catch(err => next(err));
};

//GET NEW
exports.getNew = (req, res, next) => {
    res.render('admin/cliente/new', {
        pageTitle: "Novo Cliente",
        path: "/clientes",
        subPath: "/clientes/new",
        errorMessage: [],
        form: false
    });
};

//POST NEW
exports.postNew = (req, res, next) => {
    cloudinary.v2.uploader.upload(req.file.path, {
            upload_preset: "clientes"
        })
        .then(image => {
            fileHelper.delete(req.file.path);

            new Cliente({
                    ...req.body,
                    image: image,
                    telefones: req.body.telefones ? JSON.parse(req.body.telefones).data : []
                })
                .save()
                .then(resul => {
                    res.redirect('/admin/clientes');
                })
                .catch(err => {
                    fileHelper.delete(req.file.path);
                    next(err);
                });
        })
        .catch(err => next(err, 500));
};

//GET EDIT
exports.getEdit = (req, res, next) => {
    const id = req.params.id;

    Cliente.findOne({
            _id: id
        })
        .then(cliente => {
            if (!cliente) {
                return res.redirect('/admin/clientes')
            }
            res.render('admin/cliente/edit', {
                pageTitle: "Editar Cliente",
                path: "/clientes",
                subPath: "/clientes/list",
                cliente: cliente,
                errorMessage: [],
                form: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT
exports.postEdit = (req, res, next) => {
    const form = {
        nome: req.body.nome,
        email: req.body.email,
        encarregado: req.body.encarregado,
        telefones: req.body.telefones ? JSON.parse(req.body.telefones).data : [],
    }

    Cliente.findOne({
            _id: req.body.id
        })
        .then(cliente => {

            if (!cliente) {
                return next(new Error('Houve um erro e o cliente não foi encontrado, volte e tente novamente.'));
            }

            cliente.nome = form.nome;
            cliente.email = form.email;
            cliente.encarregado = form.encarregado;
            cliente.telefones = form.telefones;

            if (req.file) {

                if (cliente.image) {
                    cloudinary.uploader.destroy(cliente.image.public_id);
                }

                cloudinary.v2.uploader.upload(req.file.path, {
                        upload_preset: "clientes"
                    })
                    .then(image => {

                        fileHelper.delete(req.file.path);
                        cliente.image = image;
                        cliente.save();
                        return res.redirect('/admin/clientes');
                    })
            } else {

                cliente.save();
                return res.redirect('/admin/clientes');
            }

        })
        .catch(err => next(err));
}

// SEARCH BY AJAX
exports.searchByAjax = (req, res, next) => {
    const text = req.query.text;
    Cliente.find({
            nome: {
                $regex: text,
                $options: 'i'
            }
        })
        .select('nome id codigo')
        .then(clientes => {
            return res.status(200).json({clientes});
        })
        .catch(err =>{
            res.status(500).json(JSON.stringify([]));
            console.log(err)
        })
}

//DELETE
exports.delete = (req, res, next) => {
    const id = req.body.id;

    Cliente.findOneAndDelete({
            _id: id
        })
        .then(cliente => {
            if(!cliente){
                return next(new Error('Cliente não encontrado para apagar.'))
            }
            cloudinary.uploader.destroy(cliente.image.public_id)
                .then(resul => {
                    
                    Depoimento.find({
                        cliente: cliente
                    })
                    .remove()
                    .then( resul => res.redirect('/admin/clientes'))
                    .catch( err => next(err, 500));
                })
                .catch(err => next(err))
        })
        .catch(err => {
            next(err, 500)
        });
};