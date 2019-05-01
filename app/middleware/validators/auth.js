const { check, body, validationResult } = require('express-validator/check');

exports.resetPassword = [
    // Express Validation
    [
        body('newpassword', 'Entre uma senha válida!')
        .isLength({
            min: 8,
            max: 20
        })
        .withMessage('The a senha deve ter entre 8 e 20 letras!')
        .trim(),

        body('confirmnewpassword')
        .custom((value, {
            req
        }) => {
            if (value !== req.body.newpassword) {
                throw new Error('As senhas devem ser iguais!')
            }
            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/auth/trocarsenha', {
                    path: 'auth/trocarsenha',
                    pageTitle: 'trocarsenha',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    user: req.body.user,
                    robotsFollow: false,
                })
        } else {
            next();
        }
    }

]

exports.login = [
    [
        body('user', 'Usuário inválido.')
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
                    robotsFollow: false,
                    contact: false
                })
        } else {
            next();
        }
    }

]