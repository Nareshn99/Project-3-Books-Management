const usermodel = require('../models/usermodel')
const validation = require('../validators/validations')
const jwt = require("jsonwebtoken")


const createUser = async (req, res) => {
    try {
        let requestBody = req.body

        let { title, name, phone, email, password, address } = requestBody

        //check for empty requestBody
        if (Object.keys(requestBody).length === 0) return res.status(400).send({ status: false, message: "Please provide user details" })
        
    
        //validation for title
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }
        let arr=["Mr","Mrs","Miss"]
        if (!validation.isValidTitle(title)) {
            return res.status(400).send({ status: false, message: `Title can only be -${arr.join(",")} / String only`})
        }

        //validation for name
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }
        if (!validation.isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name should be alphabatical Order And String is valid" })
        }

        //validation for phone
        if (!phone) {
            return res.status(400).send({ status: false, message: "Phone Number is Mandatory" })
        }
        if (!validation.isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Phone Number contain only 10 digits" })
        }
        let findbyphone = await usermodel.findOne({phone})  // Object ShortHand property
        if (findbyphone) {
            return res.status(409).send({ status: false, message: "given numder is already exist" })
        }

        //validation for email
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is Mandatory" })
        }
        if (!validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Email is Invalid" })
        }
        let findbyemail = await usermodel.findOne({ email })
        if (findbyemail) {
            return res.status(409).send({ status: false, message: "This Email is Already Exist " })
        }

        //validation for password
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is Mandatory" })
        }
        if (!validation.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }

        //validation for address
        if (address) {
            if ( Object.prototype.toString.call(address)!=="[object Object]" || Object.keys(address).length==0) {
                return res.status(400).send({ status: false, message: "Address can't be empty / Object type only " })
            }
            let {city,pincode,street}= address
            for(let key in address){
                if(address[key].length==0){
                    return res.status(400).send({status:false, msg:`pls provide valid data in ${key}`})
                }
            }
            if(city){
                if(!validation.isValidName(city)){
                    return res.status(400).send({status:false,msg:"City must contain letters only / String type"})
                }
            }
            if(pincode){
                if(!validation.isValidPincode(pincode)){
                    return res.status(400).send({status:false,msg:"pincode must be valid pincode / String type"})
                }
            }
            if(street){
                if(typeof (street) == "string" && street.trim().length==0){
                    return res.status(400).send({status:false,msg:"street value can't be empty / String type"})
                }
            }                                                                
        }


        let data = await usermodel.create(requestBody)
        return res.status(201).send({ status: true, message:"Success", data: data })
    }
    catch (err) {
        res.status(500).send({ status:false, message: err.message })
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

        let userDetails = await usermodel.findOne({ email, password })
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "Incorrect credentials" })
        }
        let token = jwt.sign(
            { userId: userDetails._id.toString() },
            "ParshantNareshPriyankaVaseem",
            { expiresIn: '1h' }
        )

        res.status(200).send({ status: true, message:"Success", data:{token:token} });

    } catch (err) {
        res.status(500).send({status:false, msg:err.message})
    }
}


module.exports={
    createUser,
    userlogin

}