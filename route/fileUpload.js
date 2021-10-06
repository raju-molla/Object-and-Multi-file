const express= require("express");
const router = express.Router();
const fileUploader = require('../middleware/fileUploader');
const {singleFileUpload,multiFileUploader,uploadBase64,uploadBase64MultiImage}= require('../controller/fileUpload')

router.put('/single-file-upload',fileUploader.single('image'),singleFileUpload)
router.put('/multi-file-upload',fileUploader.array('images',5),multiFileUploader)
router.post('/upload-base-64',uploadBase64);
router.post('/upload-base-64-multi',uploadBase64MultiImage);

module.exports=router