const Projeto = require('../../models/projeto'),
    Depoimento = require('../../models/depoimento'),
    transporter = require('../../util/email-transporter')();

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
                        deps,
                        form: false
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
                        depoimento,
                        form: false
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
                projs,
                form: false
            })
        })
        .catch(err => next(err, 500));
}

exports.getSobre = (req, res, next) => {
    Depoimento.find()
        .populate('cliente')
        .then(deps => {
            return res.render('website/sobre', {
                pageTitle: 'Sobre',
                path: '/sobre',
                deps,
                form: false
            })
        })
}

exports.getContato = (req, res, next) => {
    return res.render('website/contato', {
        pageTitle: 'Contato',
        path: '/contato',
        form: false
    })
}

exports.postContato = (req, res, next) => {
    transporter.sendMail({
        to: 'sac@evolveme.com.br',
        from: req.body.email,
        subject: 'Mensagem de contato recebida pelo site!',
        html: `
        <h3> Você recebeu uma nova mensagem de contato a partir do formulário do seu site! </h3>
        <p>De: ${req.body.nome}</p>
        <p>Telefone: ${req.body.telefone}</p>
        <p>E mail: ${req.body.email}</p>
        <p>Com a mensagem: ${req.body.mensagem}</p>
        <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
    `
    })
    .then(resul => {
        res.render('website/contato', {
            pageTitle: "Contato",
            path: "/contato",
            errorMessage: [],
            successMessage: ['Recebemos sua mensagem! Responderemos o mais rápido possível.'],
            csrfToken: req.csrfToken(),
            form: false,
        });
    })
    .catch(err => next(err))
}