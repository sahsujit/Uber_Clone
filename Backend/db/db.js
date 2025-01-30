const mongoose = require("mongoose");

function connectToDB(){
    // mongoose.connect(
    //     process.env.DB_URL, 
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // ).then(()=>console.log("Connection Successfully to DB"))
    // .catch((err)=>{
    //     console.log(err);
    //     process.exit(1)
    // })


mongoose.connect(process.env.DB_URL, {
   
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
}

module.exports = connectToDB


