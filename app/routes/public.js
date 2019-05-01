const router = require('express').Router(),
      websiteCtrl = require('../controllers/website/pages'),
      validators = {
       contato: require('../middleware/validators/contato')
      },
      setLocals = require('../middleware/set-locals');

router.get('/', setLocals, websiteCtrl.getIndex);
router.get('/sobre', setLocals, websiteCtrl.getSobre);
router.get('/portfolio', setLocals, websiteCtrl.getProjetos);
router.get('/projetos', setLocals, websiteCtrl.getProjetos);
router.get('/projeto:cod', setLocals, websiteCtrl.getProjeto);
router.get('/contato', setLocals, websiteCtrl.getContato);
router.post('/contato', validators.contato.new, websiteCtrl.postContato);

module.exports = router;