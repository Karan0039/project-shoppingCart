const jwt=require("jsonwebtoken")
  

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

module.exports.userLogin=userLogin

