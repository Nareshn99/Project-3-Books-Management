const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

const createReview = async (req, res) => {
    try {

        const requestbody = req.requestbody
        let bookId = req.params.bookId
    

        // Creating review document
        let reviewDoc = await reviewModel.create(requestbody)

        // updating book doc
        let update = await bookModel.findOneAndUpdate({ _id: bookId,isDeleted:false }, { $inc: { reviews: 1 } }, { new: true }).lean();
        if (!update) {
            return res.status(404).send({ status: false, message: "Book is not found " })
        }

        update.reviewsData=reviewDoc

        return res.status(201).send({ status: true, message: "Success", data: update })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const updateReview = async (req, res) => {
    try {

        const requestbody = req.body
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //check for exist of the bookId
        let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean();
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }
                
        // updating review doc
        let updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, {
            $set:
                requestbody
            },{ new: true}
        )
     
        if (!updatedReview) {
            return res.status(404).send({ status: false, message: "review is not found for this ID" })
        }

        book["reviewsData"] = updatedReview

        return res.status(200).send({ status: true, message: "Books list", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        //validation for bookId and reviewId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
        }
        if (!validation.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "reviewId is not valid,please enter valid ID" })
        }
       
        // Deleting review doc
        let deleteReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false },{isDeleted: true, deletedAt: moment().format("YYYY-MM-DD")});
        if (!deleteReview) {
            return res.status(404).send({ status: false, message: "review is not found " })
        }

        // updating book doc
        let updateBook = await bookModel.findOneAndUpdate({ _id: bookId , isDeleted:false}, { $inc: { reviews: -1 } }, { new: true });
        if (!updateBook) {
            return res.status(404).send({ status: false, message: "Book is not found " })
        }
        return res.status(200).send({ status: true, message: "Review Deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}



module.exports = {
    createReview,
    updateReview,
    deleteReview
}