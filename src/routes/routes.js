const express = require("express")
const route = express.Router()
const { registerUser, userLogin, updateUserProfile, getUserDetails } = require("../controllers/userController")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const  { userAuthentication }= require("../middlewares/authentication")
const  { userAuthorization }= require("../middlewares/authorization")
//User
route.post("/register", registerUser)
route.post("/login", userLogin)
route.get("/user/:userId/profile",userAuthentication, getUserDetails)
route.put("/user/:userId/profile",userAuthentication, userAuthorization, updateUserProfile)

//Product
route.post("/products", createProduct)
route.get("/products", getProducts)
route.get("/products/:productId", getProductById)
route.put("/products/:productId", updateProduct)
route.delete("/products/:productId", deleteProduct)


module.exports = route; 