const {
    check,
    body,
    validationResult
} = require('express-validator/check');

const Cliente = require('../../models/cliente');

exports.new = [
    [
        body('nome', 'O campo <strong>Nome</strong> é obrigatório!')
        .isLength({
            min: 3,
            max: 20
        })
        .withMessage('O campo <strong>Nome</strong> deve ter entre 3 e 20 letras!')
        .isString(),

        body('email', 'O campo <strong>Email</strong> deve ser um email')
        .optional()
        .isEmail()
        .trim(),

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
                .render('admin/cliente/new', {
                    path: '/clientes',
                    subPath: '/clientes/new',
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
        body('nome', 'O campo <strong>Nome</strong> é obrigatório!')
        .isLength({
            min: 3,
            max: 20
        })
        .withMessage('O campo <strong>Nome</strong> deve ter entre 3 e 20 letras!')
        .isString(),

        body('email', 'O campo <strong>Email</strong> deve ser um email')
        .optional()
        .isEmail()
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            Client.findOne({
                    _id: req.body.id
                })
                .then(cliente => {
                    return res
                        .status(422)
                        .render('admin/cliente/edit', {
                            path: '/clientes',
                            subPath: '/clientes/list',
                            errorMessage: errors.array(),
                            cliente,
                        })
                })

        } else {
            next();
        }
    }

]