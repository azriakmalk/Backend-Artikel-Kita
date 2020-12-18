const jwt = require('jsonwebtoken')
const JWT_KEY = "PRIVATE_KEY"

module.exports = (req,res,next)=>{
    const token = req.header('x-auth-token')

    if(!token){
        return res.status(401).json({
            msg:'No Token, Auth denied'
        })
    }

    try{
        const decoded = jwt.verify(token,JWT_KEY)
        req.user = decoded.user
        next()
    }catch(err){
        req.status(401).json({
            msg:"Token not valid"
        })
    }
}