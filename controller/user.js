const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')



const  getALl = async(req,res)=>{
    try{
        const data = await User.find({isDelete: false});
        if(data){
            return res.json({
                data
            })
        }
        else{
            return res.json({
                mgs: "database empty!"
            })
        }

    }
    catch(err){
        return res.json({
            err
        })
    }
}

const baseUrl= "http://localhost:30015";
const register =  async(req,res)=>{
    try{
        // const {password} = req.body;
        // const hashedPassword = await bcrypt.hash(password,10);
        // req.body.password= hashedPassword;

        // image path create
        let {image}=  req.body;
        let dataimg = image.split(';base64,');
        let base64Data= dataimg[1];
        let imgExtension =dataimg[0].split('/')[1];
        let fileName=`image${+new Date()}.${imgExtension}`;
        let pathName= `${baseUrl}/${fileName}`;
        req.body.image=pathName;

        const user = new User(req.body);
        const data =  await user.save();
        return res.status(201).json({
            mgs: "Register successfully!",
            data
        })
    }
    catch(err){
        return res.json({
            mgs: "Register failed!",
            err
        })
    }
}

const login = async (req,res)=>{
    try{
        const {email,password}= req.body;
        const user = await User.findOne({email});
        if(user){
            const isValidPass= await bcrypt.compare(password,user.password);
            if(isValidPass){
                const data={
                    name: user.name,
                    email: user.email,
                
                }
                const token = jwt.sign(data,process.env.SECRET_KEY,{expiresIn:'5d'});
                return res.json({
                    token

                })
            }
            else{
                return res.json({
                    mgs: "password is not matched"
                })
            }
        }
        else{
            return res.json({
                mgs: "Wrong email accound!"
            })
        }
    }
    catch(err){
        return res.json({
            err

        })
    }
}
const userUpdate= async(req,res)=>{
    try{
        const id = req.params.id
        await User.findOneAndUpdate(
            {_id:id},
            {
                $set: req.body
            },
            {
                multi:true
            }
        )
        return res.json({
            mgs: "User update successfully!"
        })

    }
    catch(err){
        return res.json({
            err
        })
    }
}
const temporeryDelete = async(req,res)=>{
    try{
        const id= req.params.id;
        await User.findOneAndUpdate(
            {_id:id},
            {
                $set: {isDelete:true}
            },
            {
                multi:true
            }
        )
        return res.json({
            mgs: 'data go to recycle bin!'
        })


    }
    catch(err){
        return res.json({
            err
        })
    }
}



const reStore = async(req,res)=>{
    try{
        const id= req.params.id;
        await User.findOneAndUpdate(
            {_id:id},
            {
                $set: {isDelete:false}
            },
            {
                multi:true
            }
        )
        return res.json({
            mgs: 'data re-store'
        })


    }
    catch(err){
        return res.json({
            err
        })
    }
}

const userDelete= async(req,res)=>{
    try{
        const id= req.params.id;
        await User.findOneAndDelete(
            {_id:id}
        )
        return res.json({
            msg: "Delete successfully!"
        })

    }
    catch(err){
        return res.json({
            err
        })
    }
}
const passwordUpdate =  async(req,res)=>{
    try{
        const id= req.params.id;
        const {password}= req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {_id: id},
            {
                $set: {password:hashedPassword}
            },
            {
                multi:true
            }
        )
        return res.json({
            mgs: "password update successfully!"
        })
        

    }
    catch(err){
        return res.json({
            err
        })
    }
}

const forgotPassword = async(req,res)=>{
    try{
        const {email}= req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                mgs: 'email is not matched'
            })
        }
        let otp1= Math.floor(Math.random()*8999)+1000;
        let otp2= Math.floor(Math.random()*89)+10;
        let otp =''+ otp1+otp2;
        await user.updateOne({otp});

        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'iamraju.eu56@gmail.com',
                pass: "01703634507r"
            }
        })

        let mailerOption = {
            from: "iamraju.eu56@gmail.com",
            to: email,
            subject: "Reset password",
            text: "Hello bro",
            html: `<h4>Copy the text bellow</h4> <h1>${otp}</h1>`
        }
        await transport.sendMail(mailerOption,(err,data)=>{
            if(err){
                return res.json({
                    err
                })
            }
            else{
                return res.json({
                    mgs:"sent otp successfully!"

                })
            }
        })

    }
    catch(err){
        return res.json({
            err
        })
    }
}

const otpCheak= async(req,res)=>{
    try{
        const {otp}= req.body;
        const user = await User.findOne({otp});
        if(!user){
            return res.json({
                mgs: "OTP is not matched!"
            })
        }
        const data ={
            email: user.email
        }
        const token = jwt.sign(data,process.env.SECRET_KEY,{expiresIn: "5d"});
        return res.json({
            token
        })
    }
    catch(err){
        return res.json({
            err
        })
    }
}

const resetPassword = async(req,res)=>{
    try{
        const {newPassword, confirmNewPassword}=req.body;
        if(newPassword!==confirmNewPassword){
            return res.json({
                mgs: "password is not matched!"
            })
        }
        const {token}= req.query;
        const data = jwt.verify(token,process.env.SECRET_KEY);
        const hashedPassword = await bcrypt.hash(newPassword,10);
        await User.findOneAndUpdate(
            {email:data.email},
            {
                $set: {password:hashedPassword}
            },
            {
                multi:true
            }
        )
        return res.json({
            mgs: "reset password successfully!"
        })
    }
    catch(err){
        return res.json({
            err
        })
    }
}

const hobiesPasinations= async(req,res)=>{
    try{
        const {id,pos}= req.params;
        const data= await User.find({_id:id});
        const value=data[0].hobies;
        var flag=0;
        for(var key in value){
            if(value[key].position==pos){
                flag=1;
               return res.json(value[key]);
            }
        }
        if(flag==0){
            return res.json({
                mgs: "position is not found!"
            })
        }
  

    }
    catch(err){
        return res.json({
            err

        })
    }
}
const sortByHobiesAccendingOrder= async(req,res)=>{
    try{
        const id=req.params.id;
        const data = await User.find({_id:id})
        const value= data[0].hobies;
        console.log(value);

       value.sort((a,b)=>{
           return a.position-b.position
       })
       res.send(value);

    }
    catch(err){
        return res.json({
            err
        })
    }
}

const sortByHobiesDecendingOrder= async(req,res)=>{
    try{
        const id=req.params.id;
        const data = await User.find({_id:id})
        const value= data[0].hobies;
        console.log(value);

       value.sort((a,b)=>{
           return b.position-a.position
       })
       res.send(value);

    }
    catch(err){
        return res.json({
            err
        })
    }
}


module.exports={
    getALl,
    register,
    login,
    userUpdate,
    temporeryDelete,
    reStore,
    userDelete,
    passwordUpdate,
    forgotPassword,
    otpCheak,
    resetPassword,
    hobiesPasinations,
    sortByHobiesAccendingOrder,
    sortByHobiesDecendingOrder
}