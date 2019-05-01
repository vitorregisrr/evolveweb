const express = require('express'),
    router = express.Router();

const validators = {
    auth: require('../middleware/validators/auth')
}

const authCtrl = require('../controllers/admin/auth');

//LOGIN
//GET
router.get('/admin/login', setLocals, authCtrl.getLogin);

//POST
router.post('/admin/login', setLocals, validators.auth.login, authCtrl.postLogin);

//LOGOUT
router.get('/admin/logout', setLocals, authCtrl.postLogout);

// //CHANGE PASSWORD
//     //GET
//     router.get('/admin/mudar-senha', setLocals, authCtrl.getChangePass);
//     //POST
//     router.post('/admin/mudar-senha', setLocals, validators.auth.resetPassword, authCtrl.postChangePass);

//REQUEST RESET PASSWORD
    //GET
    router.get('/admin/resetpassword', setLocals, authCtrl.getResetPassword);
    //POST
    router.post('/admin/resetpassword', setLocals, authCtrl.postResetPassword);

//RESET PASSWORD
    //GET
    router.get('/admin/newpassword/:passwordToken', setLocals, authCtrl.getNewPass);
    //POST
    router.post('/admin/newpassword', validators.auth.resetPassword, setLocals, authCtrl.postNewPass);

module.exports = router;