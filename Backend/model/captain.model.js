// const mongoose = require("mongoose") 
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")

// const captainSchema = new  mongoose.Schema({
//     fullname:{
//         firstname:{
//             type:String,
//             required:true
//         },
//         lastname:{
//             type:String,

//         }
//     },
//     email:{
//         type:String,
//         required:true,
//     },
//     password:{
//         type:String,
//         required:true,
//         select:false


//     },
//     socketId:{
//         type:String,
//      },
//      status:{
//         type:String,
//         enum:["active", "inactive"],
//         default:"inactive"
//      },

//      vehicle: {
//         color: {
//             type: String,
//             required: true,
//             minlength: [ 3, 'Color must be at least 3 characters long' ],
//         },
//         plate: {
//             type: String,
//             required: true,
//             minlength: [ 3, 'Plate must be at least 3 characters long' ],
//         },
//         capacity: {
//             type: Number,
//             required: true,
//             min: [ 1, 'Capacity must be at least 1' ],
//         },
//         vehicleType: {
//             type: String,
//             required: true,
//             enum: [ 'car', 'motorcycle', 'auto' ],
//         }
//     },
//     // location: {
//     //     ltd: {
//     //         type: Number,
//     //     },
//     //     lng: {
//     //         type: Number,
//     //     }
//     // }

//     location: {
//         type: { type: String, enum: ['Point'], required: true },
//         coordinates: { type: [Number], required: true }  // [longitude, latitude]
//       },

// })


// captainSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//     return token;
// }


// captainSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// }


// captainSchema.statics.hashPassword = async function (password) {
//     return await bcrypt.hash(password, 10);
// }

// const captainModel = mongoose.model("captain", captainSchema)
// module.exports = captainModel;


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
        select: false // This ensures password is not included by default in queries
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }
    },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }  // [longitude, latitude]
    }
});

// Create 2dsphere index for location
captainSchema.index({ location: '2dsphere' });

// Methods for generating auth token and comparing password
captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

// Create and export the model
const captainModel = mongoose.model("captain", captainSchema);
module.exports = captainModel;
