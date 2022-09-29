const jwt = require("jsonwebtoken")
const secreteKey = "ParshantNareshPriyankaVaseem"

const authenticationMid = (req,res,next)=> {
    try{
        let token = req.headers["x-api-key"]
        if(!token){
            res.status(400).send({status:false, msg:"Token not present"})
            return
        }

        let decode = jwt.verify(
            token,
            secreteKey,
            (err,result)=>{
                if(err) return res.status(401).send({status:false, msg:err.message})
                req.userId=result.userId
                next()
            }
        )
        
    }
    catch(err){
        return res.status(500).send({status:false, msg:err.message})

    }
}
//    authentication=>tokenVerufy=>authorization
module.exports={
    authenticationMid
}