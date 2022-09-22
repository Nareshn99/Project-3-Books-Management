const reviewmodel = require('../models/reviewmodel')
const bookmodel = require('../models/bookmodel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

const createreview = async (req, res) => {
    try {

        const requestbody = req.body
        let { reviewedBy, reviewedAt, rating, review } = requestbody
        let BookId = req.params.bookId
        requestbody.bookId = BookId

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(BookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }
        let book = await bookmodel.findOne({ _id: BookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        //check for empty requestBody
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide book details" })
        }

        //validation for reviewedBy
        if (!reviewedBy) {
            return res.status(400).send({ status: false, message: "ReviewedBy is mandatory" })
        }
        if (!validation.isValidName(reviewedBy)) {
            return res.status(400).send({ status: false, message: "ReviewedBy should be alphabatical Order And String is valid" })
        }

        // //validation for reviewedAt
        // if (!reviewedAt) {
        //     return res.status(400).send({ status: false, message: "ReviewedAt is mandatory" })
        // }
        // if (!moment(reviewedAt, "YYYY-MM-DD", true).isValid()) {
        //     return res.status(400).send({ status: false, msg: "ReviewedAt should be in YYYY-MM-DD format" })
        // }
        // let date = moment().format("YYYY-MM-DD")
        // if (!moment(reviewedAt).isAfter(date)) {
        //     return res.status(400).send({ status: false, msg: "pls provide an upcoming date" })
        // }

        //validation for rating
        if (!rating) {
            return res.status(400).send({ status: false, message: "Rating is mandatory" })
        }
        if (!validation.isValidrating(rating)) {
            return res.status(400).send({ status: false, message: "Rating should be in Number (1-5)" })
        }

        //validation for reviews
        if (review) {
            if (!validation.isValidName(review)) {
                return res.status(400).send({ status: false, message: "Review should be alphabatical Order And String is valid" })
            }
        }
        await reviewmodel.create(requestbody)
        let update = await bookmodel.findOneAndUpdate({ _id: BookId }, { $inc: { reviews: 1 } }, { new: true });
        res.status(201).send({ status: true, message: "Review added", data: update })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updatereview = async (req, res) => {
    try {

        const requestbody = req.body
        let { rating, review, reviewedBy } = requestbody
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
        }
        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        //validation for reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not valid,please enter valid ID" })
        }
        let reviewed = await reviewmodel.findOne({ _id: reviewId, isDeleted: false });
        if (!reviewed) {
            return res.status(404).send({ status: false, message: "review is not found for this ID" })
        }

        //check for empty requestBody
        if (Object.keys(requestbody).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide book details" })
        }

        //validation for rating
        if (rating) {
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


        let updatedreview = await reviewmodel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, {
            $set: {
                requestbody
            }, new: true
        })
        book["reviewsData"] = updatedreview

        return res.status(200).send({ status: true, message: "Update Succesfully", data: book })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const deletereview = async (req, res) => {
    try {

        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
        }
        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        //validation for reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not valid,please enter valid ID" })
        }
        let review = await reviewmodel.findOne({ _id: reviewId, isDeleted: false });
        if (!review) {
            return res.status(404).send({ status: false, message: "review is not found for this ID" })
        }

        let Update = await bookmodel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: Date(), $inc: { reviews: -1 } }, { new: true });
        return res.status(200).send({ status: true, message: "Review Deleted", data: Update })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}





module.exports = {
    createreview,
    updatereview,
    deletereview
}