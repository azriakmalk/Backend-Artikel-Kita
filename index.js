const express =require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer =require('multer')
const path = require('path')
const app = express();
const artikelRoutes = require('./src/routes/artikel');
const userRoutes = require('./src/routes/user')
const cors = require('cors');

const fileStorage = multer.diskStorage({
    // destination: (req,file,cb)=>{
    //     cb(null, 'images');
    // },
    filename:(req,file,cb)=>{
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req,file,cb)=>{
    if( file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'){
            cb(null,true)
    }else{
            cb(null,false)
    }
}

app.use(bodyParser.json())
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))

app.use(cors())
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*')
    res.header("Access-Control-Allow-Origin",'*')
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELET")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-auth-token")
    next();
})

app.use('/',artikelRoutes)

app.use((error,req,res,next)=>{
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message:message,data:data})
})

//User

app.use('/auth/user',userRoutes)




//End Userrr
const port = process.env.PORT || 4000
mongoose.connect('mongodb+srv://azri:azri123@cluster0.q3hgj.mongodb.net/Artikel?retryWrites=true&w=majority')
.then(()=>{
    app.listen(port, () => console.log(`Server berjalan di ${port}`));
})
.catch(err => console.log(err))
