const userModel = require("../model/user.model")
const  userService =require("../services/user.service")
const {validationResult} = require('express-validator')


module.exports.register= async(req, res, next)=>{
    const  errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
};