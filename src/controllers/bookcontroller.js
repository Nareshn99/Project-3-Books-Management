const bookModel = require('../models/bookModel')
const usermodel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

const createBook = async (req, res) => {

    try {
        let requestBody = req.requestBody;
        let { title,ISBN } = requestBody    

        // Check for the uniqueness of title and ISBN
        let book = await bookModel.find({$or : [ {title} , {ISBN} ] })
        for(let key of book){
            if(key.title==title.trim().toLowerCase()){
                return res.status(400).send({ status: false, message: "Given title is already taken" })
            }
            if(key.ISBN==ISBN.trim()){
                return res.status(400).send({ status: false, message: "Given ISBN is already taken" })
            }
        }
       
        // Creating book document
        let newBook = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "Success", data : newBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getBookByQueryParam = async (req, res) => {
    try {
        let filterquery=req.filterquery

        // getting book details
        const books = await bookModel.find(filterquery).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });

        if (books.length == 0) {
            return res.status(404).send({ status: false, message: "No booksfound" });
        }

        return res.status(200).send({ status: true, message: 'successfully book details', data: books });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        //validation for bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid BookId" })
        }

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).lean();
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        let bookreview = await reviewModel.find({ bookId, isDeleted: false })
        book["reviewsData"] = bookreview

        return res.status(200).send({ status: true, message: "Books list", data: book })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let requestbody = req.body
        let { title, ISBN } = requestbody

        
        // Check for the uniqueness of title and ISBN
        let book = await bookModel.find({$or : [ {title} , {ISBN} ] })
        for(let key of book){
            if(key.title==title.trim().toLowerCase()){
                return res.status(400).send({ status: false, message: "Given title is already taken" })
            }
            if(key.ISBN==ISBN.trim()){
                return res.status(400).send({ status: false, message: "Given ISBN is already taken" })
            }
        }

        const book1 = await bookModel.findOne({_id:bookId, isDeleted:false})
        if(!book1){
            return res.status(404).send({ status: false, message: "book does not exist" })
        }

        // Check for authorization
        if(req.userId !== book1.userId.toString()){
            return res.status(403).send({status:false, message:"unauthorized access"})
        } 

        let updatedBook = await bookModel.findOneAndUpdate({ _id:bookId, isDeleted:false }, {$set : requestbody },{new:true})
       

        return res.status(200).send({ status: true, message: "Success", data: updatedBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteById = async (req, res) => {
    try {

        let bookId = req.params.bookId

        //validation for bookId
        if (!validation.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "book does not exist" })
        }

        // Check for authorization
        if(req.userId!=book.userId){
            return res.status(403).send({status:false, message:"unauthorized access"})
        } 

        let update = await bookModel.findOneAndUpdate({ _id:bookId }, { isDeleted: true, deletedAt:moment().format("YYYY-MM-DD") }, { new: true });

        return res.status(200).send({ status: true, message: "successfully deleted" });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


module.exports = {
    createBook,
    getBookByQueryParam,
    getBookById,
    updateBook,
    deleteById

}


