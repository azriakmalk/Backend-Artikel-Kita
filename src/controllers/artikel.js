// console.log(req.method)
// console.log(req.originalUrl)   

const {validationResult} = require('express-validator')
const ArtikelPost = require('../models/artikel')
// const path = require('path')
// const fs = require('fs')/


exports.createArtikel = (req,res,next)=>{  
    const errors = validationResult(req)

    
    if(!errors.isEmpty()){
        const err = new Error('invalid value')
        err.errorStatus =400;
        err.data = errors.array()
        throw err;
    }

    // if(!req.file){
    //     const err = new Error('Image harus di Upload')
    //     err.errorStatus = 422;
    //     throw err;
    // }
    
    const {title,body,author,image} = req.body
    // const image = req.file.path

    const Post = new ArtikelPost({
        title:title,
        body:body,
        image:image,
        author:author
    })

    Post.save()
    .then(result=>{
        res.status(201).json({
            message:"Post Suksess",
            data:result,
        })
    })
    .catch(err =>{
        console.log('err: ',err)
    });

}

exports.getAllArtikel = (req,res,next)=>{ 
    const currentPage = req.query.page || 1;
    const perPage= req.query.perPage ||10 ;
    let totalItems;
    ArtikelPost.find()    
    .countDocuments()
    .then(count=>{
        totalItems = count;
        return ArtikelPost.find()
        .sort({"createdAt" : -1})
        .skip((parseInt(currentPage)-1)*parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result)=>{
        res.status(200).json({
            message:'Data Artikel Berhasil di GET',
            data:result,
            total_Data:totalItems,
            per_page:parseInt(perPage),
            current_page:parseInt(currentPage),
        })
    })
    .catch(err=>next(err))
    
}

exports.getArtikelById = (req,res,next)=>{
    const id = req.headers.id
    const name = req.headers.name
    
    ArtikelPost.find({author:{uid:id,name:name}})
    .sort({"createdAt" : -1})
    .then(result=>{
        if(!result){
            const error = new Error('Artikel Tidak Ditemukan')
            error.errorStatus = 404
            throw error
        }
        res.status(200).json({
            message:"Artikel telah di GET",
            data:result,
        })
    })
    .catch(err=>next(err))
}

exports.putArtikel = (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const err = new Error('invalid value')
        err.errorStatus =400;
        err.data = errors.array()
        throw err;
    }

    // if(!req.file){
    //     const err = new Error('Image harus di Upload')
    //     err.errorStatus = 422;
    //     throw err;
    // }

    const {title,body,image} = req.body
    // const image = req.file.path
    const id = req.params.id;

    ArtikelPost.findById(id)
    .then(post => {
        if(!post){
            const err = new Error('Artikel tidak ditemukan')
            err.errorStatus = 404;
            throw err
        }
        // removeImage(post.image)
        post.title=title;
        post.body = body;
        post.image = image;
        return post.save();
    })
    .then(result=>{
        res.status(200).json({
            message:'Update Sukses',
            data:result
        })
    })
    .catch(err=>next(err))
    
}

exports.deleteArtikel = (req,res,next)=>{
    const id = req.params.id;

    ArtikelPost.findById(id)
    .then(post=>{
        if(!post){
            const err = new Error('Artikel tidak ditemukan')
            err.errorStatus = 404;
            throw err
        }
        // removeImage(post.image);
        return ArtikelPost.findByIdAndRemove(id);        
    })
    .then(result=>{
        res.status(200).json({
            message:'Hapus Artikel Berhasil',
            data:result
        })
    })
    .catch(err=>next(err))
}


// const removeImage = (filePath)=>{
//     filePath = path.join(__dirname,'../..',filePath);
//     fs.unlink(filePath, err=> console.log(err))
// }