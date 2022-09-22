const bookmodel = require('../models/bookmodel')
const usermodel = require('../models/usermodel')
const reviewmodel = require('../models/reviewmodel')
const mongoose = require("mongoose")
const moment = require("moment")
const validation = require("../validators/validations")

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

        let findbytitle = await bookmodel.findOne({ title })
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

        let findbyISBN = await bookmodel.findOne({ ISBN })
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

        let data = await bookmodel.create(requestBody)
        res.status(201).send({ status: true, message: "Success", data: data })

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
        let filterquery = { ...newData, isDeleted: false, deletedAt: null };

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
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
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

        //validation for bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
        }
        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
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
            let findbytitle = await bookmodel.findOne({ title })
            if (findbytitle) {
                return res.status(400).send({ status: false, message: "Given title is already taken" })
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
            let findbyISBN = await bookmodel.findOne({ ISBN })
            if (findbyISBN) {
                return res.status(400).send({ status: false, message: "Given ISBN is already exist" })
            }
        }

        let updatedbook = await bookmodel.findOneAndUpdate({ bookId }, {
            $set: {
                title, excerpt, releasedAt, ISBN
            }, new: true
        })

        return res.status(200).send({ status: true, message: "Update Succesfully", data: updatedbook })
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
            return res.status(400).send({ status: false, message: "BookId is not valid,please enter valid ID" })
        }
        let book = await bookmodel.findOne({ _id: bookId, isDeleted: false });
        if (!book) {
            return res.status(404).send({ status: false, message: "Book is not found for this ID" })
        }

        let Update = await bookModel.findOneAndUpdate({ bookId }, { isDeleted: true, deletedAt: Date() }, { new: true });
        return res.status(200).send({ status: true, message: "successfully deleted the book", data: Update });

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


