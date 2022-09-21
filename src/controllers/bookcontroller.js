const bookmodel = require('../models/bookmodel')
const usermodel = require('../models/usermodel')
const mongoose=require("mongoose")
const moment = require("moment")
const validation=require("../validators/validations")

const createbook = async (req, res) => {
    
    try {
        let requestBody = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, releasedAt } = requestBody

        //check for empty requestBody
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please provide book details" })
        
    
        //validation for title
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is mandatory" })
        }
       
        if (!validation.isValidName(title)) {
            return res.status(400).send({ status: false, message: "Title should be alphabatical Order And String is valid" })
        }

        let findbytitle = await bookmodel.findOne({title})
        if (findbytitle) {
            return res.status(400).send({ status: false, message: "Given title is already taken" })
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
            return res.status(400).send({ status: false, msg: "Invalid userID" })
        }

        let userById = await usermodel.findById(userId)
        if (!userById) {
            return res.status(404).send({ status: false, msg: "User is not exist" })
        }

        //validation for ISBN
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        }
        if (!validation.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Invalid ISBN" })
        }

        let findbyISBN = await bookmodel.findOne({ISBN})
        if (findbyISBN) {
            return res.status(400).send({ status: false, message: "Given ISBN is already exist" })
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

        // //validation for isDeleted
        //  if (isDeleted) {
        //     if (typeof (isDeleted) !== "boolean") {
        //         return res.status(400).send({ status: false, msg: "contains only boolean value in isDeleted" })
        //     }
        //     if (isDeleted == true) { requestbody["deletedAt"] = Date.now() }
        // }

        //validation for releasedAt pending...........
        if(releasedAt){
            if(!moment(releasedAt,"YYYY-MM-DD",true).isValid()){
               return res.status(400).send({status:false, msg:"releasedAt should be in YYYY-MM-DD format"})
            }
            let date=moment().format("YYYY-MM-DD")
            if(!moment(releasedAt).isAfter(date)){
                return res.status(400).send({status:false, msg:"pls provide an upcoming date"})
            }
        }
        if(!releasedAt){
            requestBody.releasedAt=moment().add(3, 'months').format("YYYY-MM-DD")
        }

        let data = await bookmodel.create(requestBody)
        res.status(201).send({ status: true, message:"Success", data: data })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getCollege = async function (req, res) {

try {
    
    const clgName = req.query.collegeName
    const query = req.query
    const comp = ["collegeName"]
    if (!Object.keys(query).every(elem => comp.includes(elem)))
      return res.status(400).send({ status: false, msg: "wrong query parameters" });

    if (!clgName)
        return res.status(400).send({ status: false, message: "Please Enter CollegeName" })

    const clgData = await collegeModel.findOne({ name: clgName, isDeleted: false })
    if (!clgData)
        return res.status(404).send({ status: false, message: "Please Enter Valid College Name" })


    const clgId = clgData._id

    const internData = await internModel.find({ collegeId: clgId, isDeleted: false }).select({ collegeId: 0, isDeleted: 0, __v: 0 })
    if (internData.length == 0)
        return res.status(404).send({ status: false, message: "No Internship Found For This College" })
    const result = {
        name: clgData.name,
        fullName: clgData.fullName,
        logoLink: clgData.logoLink,
        interns: internData,
    }
    return res.status(200).send({ "data": result })
}
catch (err) {
    return res.status(500).send({ status: false, message: err.message });
}


}


module.exports={
    createbook

}