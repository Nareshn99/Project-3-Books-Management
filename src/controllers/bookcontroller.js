const bookmodel = require('../models/bookmodel')
const usermodel=require('../models/usermodel')

const createbook = async (req, res) => {
    try {
        requestbody = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, isDeleted } = requestbody

        //check for empty requestBody
        if (Object.keys(requestBody).length === 0) return res.status(400).send({ status: false, message: "Please provide book details" })
        
    
        //validation for title
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }
        if (!validation.isValidName(title)) {
            return res.status(400).send({ status: false, message: "Title should be alphabatical Order And String is valid" })
        }
        let findbytitle = await bookmodel.findOne({title})
        if (findbytitle) {
            return res.status(409).send({ status: false, message: "Given title is already exist" })
        }
        //validation for excerpt
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "Excerpt is mandatory" })
        }
        if (!validation.isValidName(excerpt)) {
            return res.status(400).send({ status: false, message: "Excerpt should be alphabatical Order And String is valid" })
        }
        //validation for userId
        if (!userId) {
            return res.status(400).send({ status: false, msg: "Please provide userId. it's mandatory" })
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is not valid,please enter valid ID" })
        }
        let userbyid = await usermodel.findById(userId)
        if (!userbyid) {
            return res.status(404).send({ status: false, msg: "User is not exist" })
        }
        //validation for ISBN
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        }
        if (!validation.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "ISBN should be  NUmber in String" })
        }
        let findbyISBN = await bookmodel.findOne({ISBN})
        if (findbyISBN) {
            return res.status(409).send({ status: false, message: "Given ISBN is already exist" })
        }
        //validation for category
        if (!category) {
            return res.status(400).send({ status: false, message: "Category is mandatory" })
        }
        if (!validation.isValidName(category)) {
            return res.status(400).send({ status: false, message: "Category should be alphabatical Order And String is valid" })
        }
        //validation for subcategory
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "Subcategory is mandatory" })
        }
        if (!validation.isValidName(subcategory)) {
            return res.status(400).send({ status: false, message: "Subcategory should be alphabatical Order And String is valid" })
        }
        //validation for reviews
        if(reviews){
            if (!validation.isValidreviews(reviews)) {
                return res.status(400).send({ status: false, message: "Reviews should be in Number" })
            }
        }
        //validation for isDeleted
         if (isDeleted) {
            if (typeof (isDeleted) !== "boolean") {
                return res.status(400).send({ status: false, msg: "contains only boolean value in isDeleted" })
            }
            if (isDeleted == true) { requestbody["deletedAt"] = Date.now() }
        }
        //validation for releasedAt pending...........

        let data = await bookmodel.create(requestBody)
        return res.status(201).send({ status: true, message:"Success", data: data })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports={
    createbook

}