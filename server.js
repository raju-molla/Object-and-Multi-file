const express = require('express');
const app = express();
// mongoose
const mongoose =  require('mongoose');
// route
const userRoute = require('./route/user');
// file uploader
const fileUploadRouter=  require('./route/fileUpload')
//.env
require('dotenv').config();

// bodyparser
const bodyParser=  require('body-parser')

// image static
app.use(express.static('images'))

//Set Request Size Limit
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// json formating
app.use(express.json());

// router connect
app.use('/user',userRoute)
app.use('/user',fileUploadRouter)



// home page 
app.get('/',(req,res)=>{
    res.json({
        mgs: 'This is home page'
    })
})
// if route is not found
app.get('*',(req,res)=>{
    res.json({
        mgs: "Sorry route is not found!"
    })
})
// database connect
mongoose.connect('mongodb://localhost:27017/users')
.then(()=>console.log('Database connected'))
.catch((errr)=>console.log(err));


// server 
const port = process.env.PORT;
app.listen(port, ()=>console.log(`the server is running at port ${port}`))