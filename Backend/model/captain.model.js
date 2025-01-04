const mongoose = require("mongoose") 
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const captainSchema = new  mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,

        }
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false


    },
    socketId:{
        type:String,
     },
     status:{
        type:String,
        enum:["active", "inactive"],
        default:"inactive"
     },

     vehicle:{
        color:{
            type:String,
            required:true
        },
        plate:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true
        },
        vehicleType:{
            type:String,
            required:true,
            enum:["car", "motorcycle", "auto"]
        },
        location:{
            lat:{
                type:Number,
            },
            lng:{
                type:Number,
            }
        }
     }

})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET)
    return token
}

captainSchema.methods.comparePassword = async(password)=>{
    return await bcrypt.compare(password, this.password)
}

captainSchema.statics.hashPassword  = async(password)=>{
    return await bcrypt.hash(password, 10)
}

const captainModel = mongoose.model("captain", captainSchema)
module.exports = captainModel;