const mongoose = require('mongoose');
const {Schema}=mongoose;

const imgFile = new Schema({
    image:{
        type:String,
        default: 'raju'
    }
})
module.exports= mongoose.model('img',imgFile)