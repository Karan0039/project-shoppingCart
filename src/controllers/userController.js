const userModel = require("../models/userModel")

//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

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

module.exports = { registerUser }