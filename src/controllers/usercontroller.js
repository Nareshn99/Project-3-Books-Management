const usermodel = require('../models/usermodel')
const validation = require('../validators/validations')


const createbook = async (req, res) => {
    try {
        let body = req.body

        let { title, name, phone, email, password, address } = body
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, message: "Please provide data" })
        }
        //validation for title
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }
        if (validation.isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Title is Invalid" })
        }

        //validation for name
        if (!name) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }
        if (validation.isValidName(name)) {
            return res.status(400).send({ status: false, message: "Name is not in valid formet" })
        }

        //validation for mobile
        if (!phone) {
            return res.status(400).send({ status: false, message: "Phone Number is Mendatory" })
        }
        if (validation.isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Phone Number contain only 10 digits" })
        }
        let findbyphone = await usermodel.findOne({ phone: phone })
        if (findbyphone) {
            return res.status(409).send({ status: false, message: "This Numder is Already Exist Use diffrent Number" })
        }

        //validation for email
        if (!email) {
            return res.status(400).send({ status: false, message: "Emailis Mendatory" })
        }
        if (validation.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Email is Invalid,Valid Email(abc@email.com)" })
        }
        let findbyemail = await usermodel.findOne({ email: email })
        if (findbyemail) {
            return res.status(409).send({ status: false, message: "This Email is Already Exist Use diffrent Email" })
        }

        //validation for password
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is Mendatory" })
        }
        if (validation.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password is in Invalid formate,Minimum eight and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character" })
        }

        //validation for address
        if (address) {
            if (   Object.keys(address).length==0) {
                return res.status(400).send({ status: false, message: "Address is not empty" })
            }
        }
        let data = await usermodel.create(body)
        return res.status(201).send({ status: true, data: data })
    }
    catch (err) {
        res.status(500).send({ status: true, message: err.message })
    }
}

module.exports.createbook = createbook