const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

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
            if (data.phone?.trim() && !data.phone.trim().match(/^(\+\d{1,3}[- ]?)?\d{10}$/))
                error.push("enter valid mobile number")
            //check unique phone number
            if (getPhone)
                error.push("mobile number is already in use")

            //check if password is present
            if (!isValid(data.password))
                error.push("password is required")
            //checks password length
            if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
                error.push("password must have 8-15 characters")



            if (error.length > 0)
                return error;
        }
        if (badRequest()) {
            let err = badRequest();
            return res.status(400).send({ status: false, msg: err })
        }


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
    if (email == undefined) {
        return res.status(400).send({ status: false, msg: "Please Enter Email" })
    }
    if (password == undefined) {
        return res.status(400).send({ status: false, msg: "Please Provide Password" })
    }

    if (!validateEmail(email)) {
        return res.status(400).send({ status: false, msg: "Invaild E-mail id " })
    }
    const result = await userModel.findOne({ email: email, password: password }).select({ _id: 1 })
    if (!result) {
        return res.status(400).send({ status: false, msg: "Invalid Credentials" })
    }
    const token = jwt.sign({
        userId: result._id
    }, "Project 3", { expiresIn: "10m" });
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: "logged in successfully", data: token })
}



//4.
const updateUserProfile = async function (req, res) {
    let userId = req.params.userId;

    let updatedDetails = {};

    if (req.body.fname != undefined) {
        updatedDetails['fname'] = req.body.fname;
    }

    if (req.body.lname != undefined) {
        updatedDetails['lname'] = req.body.lname;
    }

    if (req.body.email != undefined) {
        const emailAlreadyUsed = await UserModel.findOne({ email: req.body.email });

        if (emailAlreadyUsed)

            return res.status(400).send({ status: false, message: `The given email:${req.body.email} has already been used.` });

        updatedDetails['email'] = req.body.email;
    }

    if (req.body.profileImage != undefined) {
        updatedDetails['profileImage'] = req.body.profileImage;
    }

    if (req.body.phone != undefined) {
        const phoneAlreadyUsed = await UserModel.findOne({ phone: req.body.phone });

        if (phoneAlreadyUsed)

            return res.status(400).send({ status: false, message: `The given phone:${req.body.phone} number has already been used.` });

        updatedDetails['phone'] = req.body.phone;
    }

    if (req.body.password != undefined) {
        let password = req.body.password;

        if (!(password.length >= 8 && password.length <= 15))

            return res.status(400).send({ status: false, message: "password must be a string of length 8 - 15 characters." });

        updatedDetails['password'] = req.body.password;
    }

    if (req.body.address != undefined) {
        let address = JSON.parse(req.body.address);

        updatedDetails['address'] = address;
    }

    const updatedProfile = await UserModel.findByIdAndUpdate(userId, { set: updatedDetails }, { new: true });

    if (updatedProfile == null)

        return res.status(404).send({ status: false, message: "User not found." });

    return res.status(200).send({ status: true, message: "User profile updated", data: updatedProfile })
};

module.exports = { registerUser, userLogin, updateUserProfile }

