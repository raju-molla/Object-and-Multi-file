const fs = require('fs');
const Img= require('../models/images');
const fileType = require('file-type')
const singleFileUpload = async(req,res)=>{
    try{
        if(req.file){
            return res.json({
                mgs: "file uploaded properly",
                fileDetails: req.file
            })
        }
        else {
            return res.json({
                mgs: "upload a invalid image!"
            })
        }

    }
    catch(err){
        return res.json({
            err
        })
    }
}

const multiFileUploader = async(req,res)=>{
    try{
        if(req.files){
            return res.json({
                mgs: "multi file is uploaded!",
                fileDetails: req.files
            })
        }
        else{
            return res.json({
                mgs: "upload an invalid image"
            })
        }
    }
    catch(err){
        return res.json({
            err
        })
    }
}

const baseUrl= 'http://localhost:3015';
const uploadBase64 = async (req, res) => {

    try {
        const image =  req.body.image;
        const data= image.split(';base64,');
        let base64Data = data[1];
        let imgExtension = data[0].split('/')[1];
        let fileName = `image${+new Date()}.${imgExtension}`;
        let path = `${baseUrl}/${fileName}`;
        
        fs.writeFile(`${__dirname}/../images/${fileName}`,base64Data,{encoding:'base64'},function(err){
            if(err){
                return res.json({
                    err
                })
            }
            else{
                console.log("File is updated succefully!");
            }
        })

        const img= new Img({image:path});
        const result = await img.save();
        if(result){
            return res.status(201).json({
                mgs: "img gose to database"
            })
        }


    } catch (e) {
        console.log(e);
    }
}

const uploadBase64MultiImage = async(req,res)=>{
    try{
        const image = req.body.image;
        let len = image.length;
        const arr=[];
        let result=0;
        
        for(var i =0; i<len; i++){
            let data = image[i].split(';base64,');
            let base64Data = data[1];
            let imgExtension = data[0].split('/')[1];
            let fileName = `image${+new Date()}.${imgExtension}`;
            let pathName = `${baseUrl}/${fileName}`;
            // arr.push(pathName);
            fs.writeFile(`${__dirname}/../images/${fileName}`, base64Data,{encoding:"base64"},function(err){
                if(err){
                    return res.json({
                        err
                    })
                }
                else{
                    console.log('file saves!');
                }
            })
            const img = new Img({image:pathName});
            await img.save();
            result++;

        }
          
        if(result===len){
            return res.json({
                mgs: "database update!"
            })
        }

       
    }
    catch(err){
        return res.json({
            err
        })
    }
}


module.exports ={
    singleFileUpload,
    multiFileUploader,
    uploadBase64,
    uploadBase64MultiImage
    
}