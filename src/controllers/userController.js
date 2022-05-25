const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const userModel = require("../models/userModel")
const { uploadFile } = require("../awsS3/aws")
const bcrypt = require("bcrypt")


//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


//1.
const registerUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let getEmail = await userModel.findOne({ email: data.email })
        let getPhone = await userModel.findOne({ phone: data.phone })

        function badRequest() {
            let error = []
            //checks if user has given any data
            if (Object.keys(data).length == 0)
                return "Please enter data to user registration"

            //checks if fname is present
            if (!isValid(data.fname))
                error.push("first name is required")
            //checks for valid fname
            if (data.name?.trim() && !(/^[a-zA-Z]+$/.test(data.fname)))
                error.push("enter a valid first name")

            //checks if lname is present
            if (!isValid(data.lname))
                error.push("last name is required")
            //checks for valid lname
            if (data.name?.trim() && !(/^[a-zA-Z]+$/.test(data.lname)))
                error.push("enter a valid last name")

            //check if email is present
            if (!isValid(data.email))
                error.push("email is required")
            //validate email
            if (data.email?.trim() && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)))
                error.push("enter a valid email")
            //check for duplicate email
            if (getEmail)
                error.push("email is already in use")

            //check if image file is present
            if (!files || files.length == 0)
                error.push("no file found")

            //checks if phone is present or not
            if (!isValid(data.phone))
                error.push("phone number is required")
            //checks for valid phone number
            if (data.phone?.trim() && !(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(data.phone)))
                error.push("enter valid mobile number")
            //check unique phone number
            if (getPhone)
                error.push("mobile number is already in use")

            //check if password is present
            if (!isValid(data.password))
                error.push("password is required")
            if (/[ ]+/.test(data.password?.trim()))
                error.push("enter valid password")
            //checks password length
            if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
                error.push("password must have 8-15 characters")

            let address = data.address
            //street is present and valid
            if (!isValid(address.shipping.street))
                error.push("shipping/street is required")
            if (address.shipping.street?.trim() && !(/^[a-zA-Z0-9]+$/.test(address.shipping.street)))
                error.push("enter a valid shipping/street")

            //city is present and valid
            if (!isValid(address.shipping.city))
                error.push("shipping/city is required")
            if (address.shipping.city?.trim() && !(/^[a-zA-Z]+$/.test(address.shipping.city)))
                error.push("enter a valid shipping/city name")

            //pincode is present and valid
            if (!isValid(address.shipping.pincode))
                error.push("shipping/pincode is required")
            if (address.shipping.pincode?.trim() && !(/^[1-9][0-9]{5}$/.test(address.shipping.pincode)))
                error.push("enter a valid shipping/pincode")

            //street is present and valid
            if (!isValid(address.billing.street))
                error.push("billing/street is required")
            if (address.billing.street?.trim() && !(/^[a-zA-Z0-9]+$/.test(address.billing.street)))
                error.push("enter a valid billing/street")

            //city is present and valid
            if (!isValid(address.billing.city))
                error.push("billing/city is required")
            if (address.billing.city?.trim() && !(/^[a-zA-Z]+$/.test(address.billing.city)))
                error.push("enter a valid billing/city name")

            //pincode is present and valid
            if (!isValid(address.billing.pincode))
                error.push("billing/pincode is required")
            if (address.billing.pincode?.trim() && !(/^[1-9][0-9]{5}$/.test(address.billing.pincode)))
                error.push("enter a valid billing/pincode")

            if (error.length > 0)
                return error;
        }
        if (badRequest()) {
            let err = badRequest();
            return res.status(400).send({ status: false, msg: err })
        }

        //changing data to proper format
        data.fname = data.fname[0].toUpperCase() + data.fname.slice(1).toLowerCase()
        data.lname = data.lname[0].toUpperCase() + data.lname.slice(1).toLowerCase()
        data.email = data.email.toLowerCase()
        bcrypt.hash(data.password, 10, function (err, hash) {
            data.password = hash
        });

        let uploadedFileURL = await uploadFile(files[0])
        data.profileImage = uploadedFileURL
        let created = await userModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//2.
const userLogin = async function (req, res) {
    const email = req.body.email
    const password = req.body.password
    const data = req.body
    if (Object.keys(data).length == 0) {
        return res.status(400).send({ status: false, msg: "Please Enter E-mail and Password..." })
    }
    let error = []
    if (!isValid(email))
        error.push("Please Enter Email")
    if (!isValid(password))
        error.push("Please Provide Password")
    if (error.length > 0)
        return res.status(400).send({ status: false, msg: error })

    const user = await userModel.findOne({ email: email }).collation({ locale: "en", strength: 2 })
    if (!user) {
        return res.status(400).send({ status: false, msg: "email not found" })
    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (result == true) {
            const token = jwt.sign({
                userId: user._id
            }, "Project 3", { expiresIn: "30m" });
            res.status(200).send({ status: true, data: "logged in successfully", data: token })
        }
        else if (result == false)
            return res.status(400).send({ status: false, msg: "password does not match" })
    });

}



//3.
const getUserDetails = async function (req, res) {
    try {

        const userIdfromParams = req.params.userId

        if (!isValidObjectId(userIdfromParams))
            return res.status(400).send({ status: false, message: "Valid UserId is Required" });

        const checkId = await userModel.findOne({ _id: userIdfromParams }).lean()
        if (!checkId)
            return res.status(404).send({ status: false, message: "User Not Found" });

        return res.status(200).send({ status: true, message: "User details", data: checkId });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//4.
const updateUserProfile = async function (req, res) {
    let userId = req.params.userId;
    let updatedDetails = {};

    if (isValid(req.body.fname)) {
        updatedDetails['fname'] = req.body.fname;
    }

    if (isValid(req.body.lname)) {
        updatedDetails['lname'] = req.body.lname;
    }

    if (isValid(req.body.email)) {
        const emailAlreadyUsed = await userModel.findOne({ email: req.body.email });

        if (emailAlreadyUsed)
            return res.status(400).send({ status: false, message: `The given email:${req.body.email} has already been used.` });
        updatedDetails['email'] = req.body.email;
    }

    if (isValid(req.body.profileImage)) {
        updatedDetails['profileImage'] = req.body.profileImage;
    }

    if (isValid(req.body.phone)) {
        const phoneAlreadyUsed = await userModel.findOne({ phone: req.body.phone });
        if (phoneAlreadyUsed)
            return res.status(400).send({ status: false, message: `The given phone:${req.body.phone} number has already been used.` });
        updatedDetails['phone'] = req.body.phone;
    }

    if (isValid(req.body.password)) {
        let password = req.body.password;
        if (!(password.length >= 8 && password.length <= 15))
            return res.status(400).send({ status: false, message: "password must be a string of length 8 - 15 characters." });

        bcrypt.hash(password, 10, function (err, hash) {
            updatedDetails['password'] = hash
        });

    }

    //fixing needed
    if (isValid(req.body.address)) {
        let address = req.body.address;
        updatedDetails["address"] = { shipping: {}, billing: {} }
        if (isValid(address.shipping.street))
            updatedDetails.address.shipping.street = address.shipping.street;
        if (isValid(address.shipping.city))
            updatedDetails.address.shipping.city = address.shipping.city;

        if (isValid(address.shipping.pincode))
            updatedDetails.address.shipping.pincode = address.shipping.pincode;

        if (isValid(address.billing.street))
            updatedDetails.address.billing.street = address.billing.street;

        if (isValid(address.billing.city))
            updatedDetails.address.billing.city = address.billing.city;

        if (isValid(address.billing.pincode))
            updatedDetails.address.billing.pincode = address.billing.pincode;
    }

    
    const updatedProfile = await userModel.findByIdAndUpdate(userId, updatedDetails, { new: true });
    if (updatedProfile == null)
        return res.status(404).send({ status: false, message: "User not found." });
    return res.status(200).send({ status: true, message: "User profile updated", data: updatedProfile })
};

module.exports = { registerUser, userLogin, updateUserProfile, getUserDetails }

