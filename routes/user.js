const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const checkAuth = require('../middleware/user');
const multer = require('multer');       //to get form data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage:storage});  //specify folder to store files

router.get('/all/:key',checkAuth.authorize, userController.getAll);
router.get('/one/:name/:key',checkAuth.authorize,userController.getOne);
// router.post('/signup',upload.single('image'),userController.signUp);
router.post('/signup',upload.single('image'),userController.signUp);
router.patch('/login',userController.login);
router.patch('/logout/:key',userController.logout);
router.patch('/update/:key',checkAuth.authorize, userController.updateUser);
router.delete('/delete/:key',checkAuth.authorize, userController.deleteUser)

module.exports = router;
