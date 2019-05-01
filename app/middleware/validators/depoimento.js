const {
    check,
    body,
    validationResult
} = require('express-validator/check');
const Depoimento = require('../../models/depoimento'),
    mongoose = require('mongoose');

exports.new = [
    [
        body('cliente', 'O campo <strong>Cliente</strong> é obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 100
        }),

        body('descricao', 'O campo <strong>Descrição</strong> é obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 300
        }),

        body('titulo', 'O campo <strong>Título</strong> é obrigatório!')
        .isString().isLength({
            min: 5,
            max: 100
        }),

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
            return res
                .status(422)
                .render('admin/depoimento/new', {
                    path: '/depoimentos',
                    subPath: '/depoimentos/new',
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
        body('cliente', 'O campo <strong>Cliente</strong> é obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 100
        }),

        body('descricao', 'O campo <strong>Descrição</strong> é obrigatório!')
        .isString()
        .isLength({
            min: 5,
            max: 300
        }),

        body('titulo', 'O campo <strong>Título</strong> é obrigatório!')
        .isString().isLength({
            min: 5,
            max: 100
        }),

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
            Depoimento.findOne({
                    _id: req.body.id
                })
                .then(depoimento => {
                    return res
                        .status(422)
                        .render('admin/depoimento/edit', {
                            path: '/depoimentos',
                            subPath: '/depoimentos/list',
                            errorMessage: errors.array(),
                            depoimento
                        })
                })
        } else {
            next();
        }
    }

]