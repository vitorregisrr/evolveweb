const {
    check,
    body,
    validationResult
} = require('express-validator/check');
const Projeto = require('../../models/projeto'),
    mongoose = require('mongoose');

exports.new = [
    [
        body('titulo', 'O campo <strong>Título</strong> e obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 30
        }),

        body('descricao', 'O campo <strong>Descrição</strong> e obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 300
        }),

        body('link', 'O campo <strong>Link</strong> e obrigatório!')
        .isString()
        .isURL(),

        body('ano', 'O campo <strong>Ano</strong> e obrigatório!')
        .isString(),

        body('cliente', 'O campo <strong>Cliente</strong> é obrigatório!')
        .custom((value, {
            req
        }) => {
            if (!mongoose.Types.ObjectId.isValid(req.body.cliente)) {
                throw new Error('O campo <strong>Cliente</strong> é inválido!')
            }

            return true;
        }),

        body('image', 'O campo <strong>imagem</strong> é inválido, por favor escolha uma imagem!')
        .custom((value, {
            req
        }) => {
            if (!req.file) {
                throw new Error('O campo <strong>Imagem</strong> é inválido, formatos aceitos: png, jpeg e jpg.')
            }

            return true;
        })

    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/projeto/new', {
                    path: '/projetos',
                    subPath: '/projetos/new',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    }
                })
        } else {
            next();
        }
    }

]

exports.edit = [
    [
        body('titulo', 'O campo <strong>Título</strong> e obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 30
        }),

        body('descricao', 'O campo <strong>Descrição</strong> e obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 300
        }),

        body('link', 'O campo <strong>Link</strong> e obrigatório!')
        .isString()
        .isURL(),

        body('ano', 'O campo <strong>Ano</strong> e obrigatório!')
        .isString(),

        body('cliente', 'O campo <strong>Cliente</strong> é obrigatório!')
        .custom((value, {
            req
        }) => {
            if (!mongoose.Types.ObjectId.isValid(req.body.cliente)) {
                throw new Error('O campo <strong>Cliente</strong> é inválido!')
            }

            return true;
        })
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            Projeto.findOne({
                    _id: req.body.id
                })
                .then(projeto => {
                    return res
                        .status(422)
                        .render('admin/projeto/edit', {
                            path: '/projetos',
                            subPath: '/projetos/list',
                            errorMessage: errors.array(),
                            projeto
                        })
                })
        } else {
            next();
        }
    }

]