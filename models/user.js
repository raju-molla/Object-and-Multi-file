const mongoose =  require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: String,
    userName:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    userType:{
        type:String,
        enum: ['student', 'teacher', 'accounts'],
        default: 'student'
    },
    email: {
        type:String,
        required: true,
        unique:true,
        trim:true
    },
    address: {
        division: String,
        district: String,
        country: {
            type:String,
            default: "Bangladesh"
        }
    },
    password: String,
    hobies:[
        {
            name:String,
            position: Number
        }
    ],
    image: String,
    otp: '',
    isDelete: {
        type:Boolean,
        default: false
    }

})

// pre hashing password
userSchema.pre('save', async function(next){
    let user = this;
    const hashedPassword =  await bcrypt.hash(user.password,10);
    user.password= hashedPassword;
    next();
})
// userSchema.pre('save', async function(next){
//     let user= this;
//     let image= req.body.image;
//     let data= image.split(';base64,');
//     let base64Data = data[1];
//     let imgExtension = data[0].split('/')[1];
//     let fileName = `image${+new Date()}.${imgExtension}`;
//     let pathName =`${baseUrl}/${fileName}`;
//     user.image=pathName;
//     next();
// })


module.exports = mongoose.model('user',userSchema);