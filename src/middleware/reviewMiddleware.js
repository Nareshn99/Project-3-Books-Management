const reviewmodel = require('../models/reviewModel')
const bookmodel = require('../models/bookModel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

const createReviewMid = async (req, res, next) => {
    try {

        const requestbody = req.body
        let { reviewedBy, rating, review } = requestbody
        let bookId = req.params.bookId


        //validation for bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }
       
        //check for empty requestBody
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide book details" })
        }
        requestbody.bookId = bookId
        if (!validation.isValidName(reviewedBy)) {
            return res.status(400).send({ status: false, message: "ReviewedBy should be alphabatical Order And String is valid" })
        }

    
        requestbody.reviewedAt=moment().format("YYYY-MM-DD")

        //validation for rating
        if ( rating == undefined) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (!validation.isValidrating(rating)) {
            return res.status(400).send({ status: false, message: "rating must be present and in between 1-5" })
        }

        //validation for reviews
        if (review) {
            if (!validation.isValidName(review)) {
                return res.status(400).send({ status: false, message: "Review should be alphabatical Order And String is valid" })
            }
        }        
        req.requestbody=requestbody
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateReviewMid = async (req, res, next) => {
    try {

        const requestbody = req.body
        let { rating, review, reviewedBy } = requestbody
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //validation for bookId and reviewId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }
        if (!validation.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "rInvalid reviewId" })
        }


        //check for empty requestBody
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide book details" })
        }

        //validation for rating
        if (rating != undefined) {
            if (!validation.isValidrating(rating)) {
                return res.status(400).send({ status: false, message: "Rating should be in Number (1-5)" })
            }
        }

        //validation for reviews
        if (review) {
            if (!validation.isValidName(review)) {
                return res.status(400).send({ status: false, message: "Review should be alphabatical Order And String is valid" })
            }
        }

        //validation for reviewedBy
        if (reviewedBy) {
            if (!validation.isValidName(reviewedBy)) {
                return res.status(400).send({ status: false, message: "ReviewedBy should be alphabatical Order And String is valid" })
            }
        }
       next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports={
    createReviewMid,
    updateReviewMid
}