const { check, body, validationResult } = require('express-validator/check');

exports.new = [
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
                    robotsFollow: false,
                    contact: false
                })
        } else {
            next();
        }
    }

]