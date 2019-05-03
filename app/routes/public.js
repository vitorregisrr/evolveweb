const router = require('express').Router(),
      websiteCtrl = require('../controllers/website/pages'),
      websiteAPI = require('../controllers/website/api'),
      validators = {
       contato: require('../middleware/validators/contato')
      },
      setLocals = require('../middleware/set-locals');

router.get('/', setLocals, websiteCtrl.getIndex);
router.get('/sobre', setLocals, websiteCtrl.getSobre);
router.get('/portfolio', setLocals, websiteCtrl.getProjetos);
router.get('/projetos', setLocals, websiteCtrl.getProjetos);
router.get('/projeto:cod', setLocals, websiteCtrl.getProjeto);
router.get('/api/getprojetos', setLocals, websiteAPI.getProjetos);
router.get('/contato', setLocals, websiteCtrl.getContato);
router.post('/contato', setLocals, validators.contato.fast, websiteCtrl.postContato);
router.get('/evoluir', setLocals, websiteCtrl.getEvoluir);
router.post('/evoluir', validators.contato.evoluir, websiteCtrl.postEvoluir);

module.exports = router;