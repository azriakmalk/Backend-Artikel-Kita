const express = require('express');
const {body} = require('express-validator')
const auth = require('../middleware/user')

const router = express.Router();

const artikelController = require('../controllers/artikel')

router.get('/artikel',artikelController.getAllArtikel)

router.get('/artikelku',artikelController.getArtikelById)

router.post('/artikel',[
    body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
    body('body').isLength({min:5}).withMessage('Input body tidak sesuai'),],
    artikelController.createArtikel)

router.put('/artikel/:id',[
    auth,
    body('title').isLength({min: 5}).withMessage('Input title tidak sesuai'),
    body('body').isLength({min:5}).withMessage('Input body tidak sesuai')],artikelController.putArtikel);

router.delete('/artikel/:id',auth,artikelController.deleteArtikel)

module.exports= router;