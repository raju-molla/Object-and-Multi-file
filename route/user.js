const express =  require('express');
const { get } = require('mongoose');
const route = express.Router();
const auth = require('../middleware/auth');
const {
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
} = require('../controller/user')

route.get('/all-user',auth,getALl);
route.post('/register',register);
route.post('/login',login);
route.put("/update/:id",userUpdate)
route.put("/recycle-bin/:id",temporeryDelete)
route.put("/re-store/:id",reStore)
route.delete("/delete/:id",userDelete)
route.put("/password-update/:id",passwordUpdate)
route.put("/forgot-password/",forgotPassword)
route.put("/otp-cheak/",otpCheak)
route.put("/reset-password/",resetPassword)
route.get("/hobies-pos/:id/:pos",hobiesPasinations),
route.get("/sort-by-position-assending/:id",sortByHobiesAccendingOrder)
route.get("/sort-by-position-decending/:id",sortByHobiesDecendingOrder)

module.exports = route