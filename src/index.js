const express = require('express');
const route = require('./routes/routes.js');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://priyanka99:EorbzmKpqdV7ml9W@cluster0.puozp1a.mongodb.net/Group46Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})

    .then(() => console.log("MongoDb is connected......."))
    .catch(err => console.log(err))



app.use('/', route);



app.listen(3000, function () {
    console.log('Express app running on port ' +(3000))
});