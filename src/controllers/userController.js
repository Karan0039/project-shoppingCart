const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const userModel = require("../models/userModel")
const { uploadFile } = require("../awsS3/aws")
const bcrypt = require("bcrypt")
const { isRequired, isInvalid, isValid } = require("./badRequest")


//1.
const registerUser = async function (req, res) {
    try {
        let data = req.body
        let files = req.files

        let getEmail = await userModel.findOne({ email: data.email })
        let getPhone = await userModel.findOne({ phone: data.phone })
        let error = []
        if (isRequired(data, files)) {
            let err = isRequired(data, files);
            error.push(...err)
        }
        if (isInvalid(data, getEmail, getPhone)) {
            let err = isInvalid(data, getEmail, getPhone);
            error.push(...err)
        }
        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        //changing data to proper format
        let initialCapital = function (value) {
            return value[0].toUpperCase() + value.slice(1).toLowerCase()
        }
        data.fname = initialCapital(data.fname)
        data.lname = initialCapital(data.lname)
        data.address.shipping.city = initialCapital(data.address.shipping.city)
        data.address.billing.city = initialCapital(data.address.billing.city)
        data.email = data.email.toLowerCase()

        data.password = await bcrypt.hash(data.password, 10)

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
    try {
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
                return res.status(400).send({ status: false, msg: "Incorrect Password" })
        });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
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
    let data = req.body
    let getEmail = await userModel.findOne({ email: data.email })
    let getPhone = await userModel.findOne({ phone: data.phone })
    let error = []

    if (isInvalid(data, getEmail, getPhone)) {
        let err = isInvalid(data, getEmail, getPhone);
        error.push(...err)
    }
    if (error.length > 0)
        return res.status(400).send({ status: false, message: error })

    if (data.password?.trim())
        data.password = await bcrypt.hash(data.password, 10)
    //changing data to proper format
    let initialCapital = function (value) {
        return value[0].toUpperCase() + value.slice(1).toLowerCase()
    }
    
    if (data.fname?.trim())
        data.fname = initialCapital(data.fname)

    if (data.lname?.trim())
        data.lname = initialCapital(data.lname)

    if (data.address) {
        if (data.address.shipping) {
            if (data.address.shipping.city?.trim())
                data.address.shipping.city = initialCapital(data.address.shipping.city)
        }

        if (data.address.billing) {
            if (data.address.billing.city?.trim())
                data.address.billing.city = initialCapital(data.address.billing.city)
        }
    }
    if (data.email?.trim())
        data.email = data.email.toLowerCase()

    let updatedProfile = await userModel.findByIdAndUpdate(userId, [{ $addFields: data }], { new: true });
    if(data.password)
    updatedProfile = await userModel.findByIdAndUpdate(userId, { $set:{password: data.password }}, { new: true });
    return res.status(200).send({ status: true, message: "User profile updated", data: updatedProfile })
};

module.exports = { registerUser, userLogin, updateUserProfile, getUserDetails }

