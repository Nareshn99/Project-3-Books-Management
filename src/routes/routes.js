const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller')
const bookcontroller = require('../controllers/bookcontroller')
const reviewcontroller=require('../controllers/reviewcontroller')
const authMid = require("../middleware/auth")
const userMid = require("../middleware/userMiddleware")
const bookMid = require("../middleware/bookMiddleware");
const reviewMid = require("../middleware/reviewMiddleware")





router.get('/test-me', (req, res) => {
    res.send("this API run succesfully...")
})




//API for USER
router.post('/register',userMid.createUserMid, usercontroller.createUser)
router.post('/login', usercontroller.userlogin)


//API for BOOKS
router.post('/books',authMid.authenticationMid,bookMid.createBookMid, bookcontroller.createBook)
router.get("/books",authMid.authenticationMid, bookMid.getBookByQueryParamMid, bookcontroller.getBookByQueryParam)
router.get("/books/:bookId",authMid.authenticationMid, bookcontroller.getBookById)
router.put("/books/:bookId",authMid.authenticationMid, bookMid.updateBookMid, bookcontroller.updateBook)
router.delete("/books/:bookId",authMid.authenticationMid, bookcontroller.deleteById)

//API for REVIEW
router.post('/books/:bookId/review',reviewMid.createReviewMid, reviewcontroller.createReview)
router.put('/books/:bookId/review/:reviewId',reviewMid.updateReviewMid, reviewcontroller.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewcontroller.deleteReview)

//errorHandling for wrong address
router.all("/**", function (req, res) {
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router