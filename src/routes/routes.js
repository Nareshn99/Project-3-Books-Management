const express=require('express');
const router=express.Router();
const usercontroller=require('../controllers/usercontroller')
const bookcontroller=require('../controllers/bookcontroller')


router.get('/test-me',(req,res)=>{
    res.send("this API run succesfully...")
})


//API for USER
router.post('/register',usercontroller.createUser)
router.post('/login',usercontroller.userlogin)

//API for BOOKS
router.post('/books',bookcontroller.createbook)




//errorHandling for wrong address
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports=router