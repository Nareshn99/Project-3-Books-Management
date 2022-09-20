const express=require('express');
const router=express.Router();
const usercontroller=require('../controllers/usercontroller')



router.get('/test-me',(req,res)=>{
    res.send("this API run succesfully...")
})

router.post('/register',usercontroller.createbook)
router.post('/register',usercontroller.createbook)





//errorHandling for wrong address
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports=router