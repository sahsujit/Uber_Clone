const captainModel = require("../model/captain.model")

module.exports.createCaptain = async({
    firstname, lastname, email, password, color, plate, capacity, vehicleType
}) => {
    if(!firstname || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error("Please fill all the fields")
    }

    const captain = await captainModel.create({
        fullname:{
            firstname, lastname
        },
        email, password, 
        vehicle:{
            color, plate, capacity, vehicleType
        }
    })
    return captain
}