const jwt=require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const { findById } = require("../models/cartModel")
const userModel = require("../models/userModel")
  

    const userLogin=async function(req,res){
    const email=req.body.email
    const password=req.body.password
    const data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter E-mail and Password..." })
        }
        if (email == undefined) {
            return res.status(400).send({ status: false, msg: "Please Enter Email" })
        }
        if (password == undefined) {
            return res.status(400).send({ status: false, msg: "Please Provide Password" })
        }
       
        if (!validateEmail(email)) {
            return res.status(400).send({ status: false, msg: "Invaild E-mail id " })
        }
    const result =await userModel.findOne({email:email,password:password}).select({_id:1})
    if (!result) {
        return res.status(400).send({ status: false, msg: "Invalid Credentials" })
    }
    const token = jwt.sign({
        userId: result._id
    }, "Project 3",{expiresIn:"10m"});
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: "logged in successfully",data:token })
}


const getUserDetails = async function(req,res){
   try {

    const userIdfromParams = req.params.userId
    const userIdFromToken = req.userId

    if(isValidObjectId(userIdfromParams)){
        return res.status(400).send({status:false, message:"Valid UserId is Required"});
    }
    const checkId = await userModel.findOne({ _id: userIdfromParams }).lean() 
    if (!checkId) {
        return res.status(404).send({status:false, message:"User Not Found"});
    }



    if (userIdFromToken != userIdfromParams){
        return res.status(403).send({status: false, message:"Unauthorized access"});
    };

        return res.status(200).send({ status: true, message: "User details", data: checkId });




   } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
   }
}

module.exports.userLogin=userLogin
module.exports.getUserDetails=getUserDetails

