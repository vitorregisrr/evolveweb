const express = require('express'),
    router = express.Router(),
    isAuth = require('../middleware/is-auth');

const validators = {
    projeto: require('../middleware/validators/projeto'),
    cliente: require('../middleware/validators/cliente'),
    depoimento: require('../middleware/validators/depoimento'),
    noticia: require('../middleware/validators/noticia'),
}

const adminCtrl = {
    index: require('../controllers/admin/index'),
    projeto: require('../controllers/admin/projeto'),
    noticia: require('../controllers/admin/noticia'),
    depoimento: require('../controllers/admin/depoimento'),
    cliente: require('../controllers/admin/cliente'),
}

//// INDEX ////
//GET
router.get('/admin', isAuth, setLocals, adminCtrl.index.getIndex);

//// PROJETOS ////
//GET ALL
router.get('/admin/projetos', isAuth, setLocals, adminCtrl.projeto.getAll);
//GET ONE
router.get('/admin/projetos/projeto:cod', isAuth, setLocals, adminCtrl.projeto.getOne);
//GET NEW
router.get('/admin/projetos/new', isAuth, setLocals, adminCtrl.projeto.getNew);
//POST NEW
router.post('/admin/projetos/new', isAuth, setLocals, validators.projeto.new, adminCtrl.projeto.postNew);
//GET EDIT
router.get('/admin/projetos/edit:cod', isAuth, setLocals, adminCtrl.projeto.getEdit);
//POST EDIT
router.post('/admin/projetos/edit', isAuth, setLocals, validators.projeto.edit, adminCtrl.projeto.postEdit);
//IMAGES
router.get('/admin/projetos/images:cod', isAuth, setLocals, adminCtrl.projeto.getImages);
//SET IMAGE
router.post('/admin/projetos/addimage', isAuth, setLocals, adminCtrl.projeto.addImage);
//DELETE IMAGE
router.post('/admin/projetos/removeimage', isAuth, setLocals, adminCtrl.projeto.deleteImage);
//POST DELETE
router.post('/admin/projetos/delete', isAuth, setLocals, adminCtrl.projeto.delete);

//// DEPOIMENTOS ////
//GET ALL
router.get('/admin/depoimentos', isAuth, setLocals, adminCtrl.depoimento.getAll);
//GET ONE
router.get('/admin/depoimentos/depoimento:id', isAuth, setLocals, adminCtrl.depoimento.getOne);
//GET NEW
router.get('/admin/depoimentos/new', isAuth, setLocals, adminCtrl.depoimento.getNew);
//POST NEW
router.post('/admin/depoimentos/new', isAuth, setLocals, validators.depoimento.new, adminCtrl.depoimento.postNew);
//GET EDIT
router.get('/admin/depoimentos/edit:id', isAuth, setLocals, adminCtrl.depoimento.getEdit);
//POST EDIT
router.post('/admin/depoimentos/edit', isAuth, setLocals, adminCtrl.depoimento.postEdit);
//POST DELETE
router.post('/admin/depoimentos/delete', isAuth, setLocals, adminCtrl.depoimento.delete);

//// CLIENTES ////
//GET ALL
router.get('/admin/clientes', isAuth, setLocals, adminCtrl.cliente.getAll);
//GET ONE
router.get('/admin/clientes/cliente:id', isAuth, setLocals, adminCtrl.cliente.getOne);
//GET NEW
router.get('/admin/clientes/new', isAuth, setLocals, adminCtrl.cliente.getNew);
//POST NEW
router.post('/admin/clientes/new', isAuth, setLocals, validators.cliente.new, adminCtrl.cliente.postNew);
//GET EDIT
router.get('/admin/clientes/edit:id', isAuth, setLocals, adminCtrl.cliente.getEdit);
//POST EDIT
router.post('/admin/clientes/edit', isAuth, setLocals, adminCtrl.cliente.postEdit);
//SEARCH BY AJAX
router.get('/admin/clientes/searchbyajax', isAuth, setLocals, adminCtrl.cliente.searchByAjax);
//POST DELETE
router.post('/admin/clientes/delete', isAuth, setLocals, adminCtrl.cliente.delete);

//// NOTICIAS ////
//GET ALL
router.get('/admin/noticias', isAuth, setLocals, adminCtrl.noticia.getAll);
//GET ONE
router.get('/admin/noticias/noticia:id', isAuth, setLocals, adminCtrl.noticia.getOne);
//GET NEW
router.get('/admin/noticias/new', isAuth, setLocals, adminCtrl.noticia.getNew);
//POST NEW
router.post('/admin/noticias/new', isAuth, setLocals, validators.noticia.new, adminCtrl.noticia.postNew);
//GET EDIT
router.get('/admin/noticias/edit:cod', isAuth, setLocals, adminCtrl.noticia.getEdit);
//POST EDIT
router.post('/admin/noticias/edit', isAuth, setLocals, adminCtrl.noticia.postEdit);
//POST DELETE
router.post('/admin/noticias/delete', isAuth, setLocals, adminCtrl.noticia.delete);

module.exports = router;