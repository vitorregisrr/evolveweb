const { check, body, validationResult } = require('express-validator/check');

exports.fast = [
    [
        body('nome', 'Precisamos saber seu <strong>Nome</strong>.')
        .isString()
        .isLength({
            min: 5,
            max: 50
        })
        .withMessage('Seu <strong>Nome</strong> deve ter entre 5 e 50 caracteres.'),

        body('email', 'Precisamos saber seu <strong>Email</strong>.')
        .isEmail()
        .withMessage('Seu <strong>Email</strong> não parece ser um email, por favor verifique.')
        .trim(),

        body('telefone', 'Precisamos saber seu <strong>Telefone</strong>.')
        .isString()
        .isLength({
            min:8,
            max: 15 
        })
        .withMessage('Seu <strong>Telefone</strong> deve ter entre 8 e 16 caracteres, por favor verifique.')
        .trim(),

        body('mensagem', 'Por favor, escreva uma <strong>Mensagem</strong>.')
        .isString()
        .isLength({
            min: 10, 
        })
        .withMessage('Sua <strong>Mensagem</strong> é muito pequena. Pode escrever mais um pouco? ')
        .trim(),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('website/contato', {
                    path: '/contato',
                    pageTitle: 'Contato',
                    errorMessage: errors.array(),
                    csrfToken: req.csrfToken(),
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

exports.evoluir = [
    [
        body('usuario', 'Usuário inválido.')
        .isString(),

        body('password', 'Senha inválida, por favor insira uma senha.')
        .isLength({
            min: 8,
            max: 20
        })
        .withMessage('A senha deve ter entre 8 e 20 caracteres.')
        .trim(),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/auth/login', {
                    path: '/login',
                    pageTitle: 'Sign Up',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    csrfToken: req.csrfToken(),
                    robotsFollow: false,
                    contact: false
                })
        } else {
            next();
        }
    }

]