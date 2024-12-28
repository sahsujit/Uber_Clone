const mongoose = require("mongoose");

function connectToDB(){
    mongoose.connect(
        process.env.DB_URL, 
    ).then(()=>console.log("Connection Successfully to DB"))
    .catch((err)=>{
        console.log(err);
        process.exit(1)
    })
}

module.exports = connectToDB