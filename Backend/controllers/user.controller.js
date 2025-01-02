const userModel = require("../model/user.model")
const  userService =require("../services/user.service")
const {validationResult} = require('express-validator')


module.exports.register= async(req, res, next)=>{
    const  errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {fullname, email, password}= await req.body;

    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashPassword
    })

    const token = user.generateAuthToken();
    res.status(201).json({token, user})


};

module.exports.loginUser = async(req, res, next)=>{
    const  errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({message: "Invalid email and password"})
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message: "Invalid  password"})
    }
    const token = user.generateAuthToken();

    return res.status(200).json({token, user})
}