const Projeto = require('../../models/projeto'),
    Depoimento = require('../../models/depoimento');

    exports.getIndex = (req, res, next) => {
        Projeto.find({
                destaque: true
            })
            .then(projs => {
                Depoimento.find({
                        destaque: true
                    })
                    .populate('cliente')
                    .then(deps => {
                        return res.render('website/index', {
                            pageTitle: 'Início',
                            path: '/',
                            projs,
                            deps
                        })
                    })
                    .catch(err => next(err, 500));
            })
            .catch(err => next(err, 500));
    }

exports.getProjeto = (req, res, next) => {
    Projeto.findOne({
            codigo: req.params.cod
        })
        .populate('cliente')
        .then(proj => {
            if (!proj) {
                return next(new Error('Não encontramos projetos com esse código.'));
            }

            Depoimento.findOne({
                    _id: proj.cliente.depoimento
                })
                .then(depoimento => {
                    return res.render('website/projeto', {
                        pageTitle: 'Projetos',
                        path: '/projetos',
                        proj,
                        depoimento
                    })
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err))
}

exports.getProjetos = (req, res, next) => {
    Projeto.find()
        .limit(5)
        .then(projs => {
            return res.render('website/projetos', {
                pageTitle: 'Projetos',
                path: '/projetos',
                projs
            })
        })
        .catch(err => next(err, 500));
}

exports.getSobre = (req, res, next) => {
    return res.render('website/sobre', {
        pageTitle: 'Sobre',
        path: '/sobre'
    })
}

exports.getContato = (req, res, next) => {
    return res.render('website/contato', {
        pageTitle: 'Contato',
        path: '/contato'
    })
}

exports.postContato = (req, res, next) => {
    return res.render('website/contato', {
        pageTitle: 'Contato',
        path: '/contato'
    })
}