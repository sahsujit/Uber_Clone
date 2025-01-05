const express = require("express")
const router = express.Router();
const {body} = require("express-validator")

router.post("/register",[
    body("fullname.firstname").isLength({min:3})
    .withMessage("First name must  be at least 3 characters long."),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long."),
    body("vahicle.color").isLength({min:3}).withMessage("Color must be at least 3 characters long."),
    body("vahicle.plate").isLength({min:3}).withMessage("Plate must be at least 3 characters long."),
    body("vahicle.capacity").isInt({min:1}).withMessage("Capacity must be at least 1."),
    body("vahicle.vahicleType").isIn(["car", "motorcycle", "auto"]).withMessage("Invalid vahicle.")
])





module.exports = router;