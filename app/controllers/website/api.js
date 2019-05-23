const Projeto = require('../../models/projeto');

exports.getProjetos = (req, res, next) => {
    const current_page = parseInt(req.query.current_page) || 1;
    const page_items = parseInt(req.query.page_items) || 5;

    query = {};
    if( req.query.categoria ){
        query.categoria = req.query.categoria
    }
    
    Projeto.find({...query})
        .countDocuments()
        .then(num => {
            const totalItems = num;
            const totalPages = Math.ceil(totalItems / page_items);

            Projeto.find({...query})
                .skip((current_page - 1) * page_items)
                .limit(page_items)
                .then(projetos => {
                    return res.status(200).json(JSON.stringify({
                        projetos: projetos,
                        has_next: current_page < totalPages,
                    }));
                })
                .catch(err => res.status(500).json({
                    "message": err
                }))
        })
        .catch(err => res.status(500).json({
            "message": err
        }))
}