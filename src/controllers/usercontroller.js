const userModel = require('../models/userModel')
const validation = require('../validators/validations')
const jwt = require("jsonwebtoken")


const createUser = async (req, res) => {
    try {
        let requestBody = req.body

        let { phone, email, } = requestBody
        
        // Check for uniqueness of phone and email
        let user = await userModel.find({$or : [ {phone} , {email} ] })
        for(let key of user){
            if(key.phone==phone.trim()){
                return res.status(400).send({ status: false, message: "Given phone is already taken" })
            }
            if(key.email==email.trim().toLowerCase()){
                return res.status(400).send({ status: false, message: "Given email is already taken" })
            }
        }

        // Creating user document
        let data = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message:"Success", data: data })
    }
    catch (err) {
        return res.status(500).send({ status:false, message: err.message })
    }
}


const userlogin = async function (req, res) {
    try {
        let requestBody = req.body
        let {email,password}=requestBody

        if(Object.keys(requestBody).length==0){
            return res.status(400).send({status:false,msg:"please provide user details to login"})
        }


        if (!email) {
            return res.status(400).send({ status: false, msg: "Please provide email" })
        }
        if(!validation.isValidEmail(email)){
            return res.status(400).send({ status: false, msg: "Invalid email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Please provide password" })
        }

        let userDetails = await userModel.findOne({ email, password })
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "Incorrect credentials" })
        }
        let token = jwt.sign(
            { userId: userDetails._id.toString() },
            "ParshantNareshPriyankaVaseem",
            { expiresIn: '1h' }
        )
        
        return res.status(201).send({ status: true, message:"Success", data:{token:token} });

    } catch (err) {
        return res.status(500).send({status:false, message:err.message})
    }
}


module.exports={createUser, userlogin }