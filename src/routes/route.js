const express = require("express")
const route = express.Router()
const { registerUser, userLogin, updateUserProfile, getUserDetails } = require("../controllers/userController")

route.post("/register", registerUser)
route.post("/login", userLogin)
route.get("/user/:userId/profile", getUserDetails)
route.put("/user/:userId/profile", updateUserProfile)


module.exports = route;