const { check, body, validationResult } = require('express-validator/check');

exports.new = [
    [
        body('nome', 'O campo <strong>Nome</strong> e obrigatório!')
        .isString()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/noticia/new', {
                    path: '/noticias',
                    subPath: '/noticias/new', 
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

exports.edit= [
    [
        body('nome', 'O campo <strong>Nome</strong> e obrigatório!')
        .isString()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/noticia/edit', {
                    path: '/noticias',
                    subPath: '/clientes/list', 
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