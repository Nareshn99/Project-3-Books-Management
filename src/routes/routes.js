const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller')
const bookcontroller = require('../controllers/bookcontroller')
const reviewcontroller=require('../controllers/reviewcontroller')

router.get('/test-me', (req, res) => {
    res.send("this API run succesfully...")
})


//API for USER
router.post('/register', usercontroller.createUser)
router.post('/login', usercontroller.userlogin)

//API for BOOKS
router.post('/books', bookcontroller.createbook)
router.get("/books", bookcontroller.getBookByQueryParam)
router.get("/books/:bookId", bookcontroller.getBookById)
router.put("/books/:bookId", bookcontroller.updatebook)
router.delete("/books/:bookId", bookcontroller.deletebyId)

//API for REVIEW
router.post('/books/:bookId/review',reviewcontroller.createreview)
router.put('/books/:bookId/review/:reviewId',reviewcontroller.updatereview)
router.delete('/books/:bookId/review/:reviewId',reviewcontroller.deletereview)

//errorHandling for wrong address
router.all("/**", function (req, res) {
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router