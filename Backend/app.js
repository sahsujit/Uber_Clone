require("dotenv").config();
const express = require("express");
const cors = require("cors")
const app = express();
const connectToDB = require("./db/db")
const  userRoute = require("./routes/user.route")
const captainRoute = require("./routes/captain.route")
const cookieParser = require("cookie-parser")
const mapsRoute = require("./routes/map.routes")

connectToDB();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())



app.get("/", (req, res)=>{
    res.send("Hello, World!");
})
app.use("/users", userRoute)
app.use("/captains", captainRoute)
app.use("/maps", mapsRoute)



module.exports = app;