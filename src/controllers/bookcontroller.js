const bookmodel = require('../models/bookmodel')
const usermodel = require('../models/userModel')
const reviewmodel = require('../models/reviewmodel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

const createbook = async (req, res) => {

    try {
        let requestBody = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, deletedAt, releasedAt } = requestBody

        
        // Check for the uniqueness of title and ISBN
        let book = await bookmodel.find({$or : [ {title} , {ISBN} ] })
        for(let key of book){
            if(key.title==title.trim().toLowerCase()){
                return res.status(400).send({ status: false, message: "Given title is already taken" })
            }
            if(key.ISBN==ISBN.trim()){
                return res.status(400).send({ status: false, message: "Given ISBN is already taken" })
            }
        }
       
        // Creating book document
        let newBook = await bookmodel.create(requestBody)
        res.status(201).send({ status: true, message: "Success", data : newBook })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const getBookByQueryParam = async (req, res) => {
    try {
        let newData = req.query
        const { userId, category, subcategory } = newData

        //check for empty requestBody
        if (Object.keys(newData).length == 0) {
            return res.status(400).send({ status: false, message: "queries shouldn't be empty" })
        }

        let arr=["userId", "category", "subcategory"]
        for(let key in newData){
            if(!arr.includes(key)){
                res.status(400).send({status:false, msg:`QueryParams can only be - ${arr.join(",")}`})
                return
            }
        }

        for(let key in newData){
            if(newData[key].length==0){
                res.status(400).send({status:false, msg:`${key} can't be empty`})
                return
            }
        }

        let filterquery = { ...newData, isDeleted: false };

        //validation for userId
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, msg: "Invalid userID" })
            }
        }

        //validation for category
        if (category) {
            if (!validation.isValidName(category)) {
                return res.status(400).send({ status: false, message: "Invalid category" })
            }
        }

        //validation for subcategory
        if (subcategory) {
            if (!validation.isValidName(subcategory)) {
                return res.status(400).send({ status: false, message: "Invalid subcategory" })
            }
        }

        const books = await bookmodel.find(filterquery).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });

        if (books.length == 0) {
            return res.status(404).send({ status: false, message: "No booksfound" });
        }

        res.status(200).send({ status: true, message: 'successfully book details', data: books });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid BookId" })
        }

        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false }).lean();
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        let bookreview = await reviewmodel.find({ bookId: bookId, isDeleted: false })
        book["reviewsData"] = bookreview

        res.status(200).send({ status: true, message: "Books list", data: book })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updatebook = async (req, res) => {
    try {

        let bookId = req.params.bookId
        console.log(bookId)
      
        let requestbody = req.body
        let { title, excerpt, releasedAt, ISBN } = requestbody

        
        // Check for the uniqueness of title and ISBN
        let book = await bookmodel.find({$or : [ {title} , {ISBN} ] })
        for(let key of book){
            if(key.title==title.trim().toLowerCase()){
                return res.status(400).send({ status: false, message: "Given title is already taken" })
            }
            if(key.ISBN==ISBN.trim()){
                return res.status(400).send({ status: false, message: "Given ISBN is already taken" })
            }
        }

        let updatedBook = await bookmodel.findOneAndUpdate({ _id:bookId, isDeleted:false }, {$set : requestbody },{new:true})
        if(!updatedBook){
            return res.status(404).send({ status: false, message: "book does not exist" })
        }

        res.status(200).send({ status: true, message: "Update Succesfully", data: updatedBook })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const deletebyId = async (req, res) => {
    try {

        let bookId = req.params.bookId

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "book does not exist" })
        }

        // Check for authorization
        if(req.userId!=book.userId){
            return res.status(403).send({status:false, msg:"unauthorized access"})
        } 

        let update = await bookmodel.findOneAndUpdate({ _id:bookId }, { isDeleted: true, deletedAt:moment().format("YYYY-MM-DD") }, { new: true });
        // console.log(update)

        res.status(200).send({ status: true, message: "successfully deleted" });

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


module.exports = {
    createbook,
    getBookByQueryParam,
    getBookById,
    updatebook,
    deletebyId

}


