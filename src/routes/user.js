const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {check,validationResult} = require('express-validator')
const User = require('../models/user')
const JWT_KEY = "PRIVATE_KEY"
const auth = require('../middleware/user')

router.post('/register',[
    check('name','Nama harus diisi').not().isEmpty(),
    check('email','Email harus di isi').isEmail(),
    check('password','Password harus di isi minimal 6 karakter').isLength({
        min:6
    })
],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    const {name,email,password} = req.body
    
    try{
        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                errors:[
                    {
                        msg:'User already exists',
                    }
                ]
            })
        }
        user = new User({
            name,email,password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt)
        await user.save();
        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            JWT_KEY,{
                expiresIn: 36000
            },(err,token)=>{
                if(err)throw err;
                res.json({token})
            }
        )
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})


router.post('/login',[
    check('email','Masukkan email yang benar').isEmail(),
    check('password','Password dibutuhkan').exists()
],async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }

    const {email,password} = req.body;

    try{
        let user = await User.findOne({
            email
        })

        if(!user){
            return res.status(400).json({
                errors:[{
                    msg:'Invalid Credentials'
                }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                errors:[{
                    msg:'Invalid credentials'
                }]
            })
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            JWT_KEY,{
                expiresIn:3600
            },(err,token)=>{
                if(err)throw err;
                res.json({
                    token
                })
            }
        )
    }catch(error){
        console.log('Error :',error.message)
        res.status(500).send('Server Error')
    }
})

router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password') 
        res.json(user)
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})
module.exports = router