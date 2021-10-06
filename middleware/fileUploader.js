
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './images');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
})

const uploader = multer({
    storage:fileStorage,
    limits:{
        fieldSize: 15000000
    }
})

module.exports= uploader