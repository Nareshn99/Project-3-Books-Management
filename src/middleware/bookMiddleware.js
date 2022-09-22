const bookmodel = require('../models/bookmodel')
const usermodel = require('../models/userModel')
const reviewmodel = require('../models/reviewmodel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")



const createBookMid = async (req, res,next) => {

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

       

        //validation for ISBN
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        }
        if (!validation.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: "Invalid ISBN" })
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
        if (reviews) {
            if (!validation.isValidreviews(reviews)) {
                return res.status(400).send({ status: false, message: "Reviews should be in Number" })
            }
        }

        //validation for releasedAt pending...........
        if (releasedAt) {
            if (!moment(releasedAt, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).send({ status: false, msg: "releasedAt should be in YYYY-MM-DD format" })
            }
            let date = moment().format("YYYY-MM-DD")
            if (!moment(releasedAt).isAfter(date)) {
                return res.status(400).send({ status: false, msg: "pls provide an upcoming date" })
            }
        }
        if (!releasedAt) {
            requestBody.releasedAt = moment().add(3, 'months').format("YYYY-MM-DD")
        }

        req.requestBody=requestBody
        next()

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateBookMid = async (req, res, next) => {
    try {

        let bookId = req.params.bookId

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

      
        let requestbody = req.body
        let { title, excerpt, releasedAt, ISBN } = requestbody

        //check for empty requestBody
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide book details" })
        }

        //validation for title
        if (title) {
            if (!validation.isValidName(title)) {
                return res.status(400).send({ status: false, message: "Title should be alphabatical Order And String is valid" })
            }
            
        }

        //validation for excerpt
        if (excerpt) {
            if (!validation.isValidName(excerpt)) {
                return res.status(400).send({ status: false, message: "Excerpt should be alphabatical Order And String is valid" })
            }
        }

        //validation for relesedate
        if (releasedAt) {
            if (!moment(releasedAt, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).send({ status: false, msg: "releasedAt should be in YYYY-MM-DD format" })
            }
            let date = moment().format("YYYY-MM-DD")
            if (!moment(releasedAt).isAfter(date)) {
                return res.status(400).send({ status: false, msg: "pls provide a valid date" })
            }
        }

        //validation for ISBN
        if (ISBN) {
            if (!validation.isValidISBN(ISBN)) {
                return res.status(400).send({ status: false, message: "Invalid ISBN" })
            }
            
        }

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports={
    createBookMid,
    updateBookMid

}