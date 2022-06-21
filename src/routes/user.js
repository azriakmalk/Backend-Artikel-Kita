const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {check,validationResult} = require('express-validator')
const User = require('../models/user')
const JWT_KEY = "PRIVATE_KEY"
const auth = require('../middleware/user')
const userController = require('../controllers/user')

router.post('/register',[
    check('name','Nama harus diisi').not().isEmpty(),
    check('email','Email harus di isi').isEmail(),
    check('password','Password harus di isi minimal 6 karakter').isLength({
        min:6
    })
], userController.createUser)


router.post('/login',[
    check('email','Masukkan email yang benar').isEmail(),
    check('password','Password dibutuhkan').exists()
], userController.loginUser)

router.get('/', auth, userController.userById)
module.exports = router