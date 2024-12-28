const mongoose = require("mongoose")

const userSchema =new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,

        }
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true


    },
    socketId:{
        type:String,
     }
})