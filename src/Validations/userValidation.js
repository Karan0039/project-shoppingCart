//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

function isRequired(data, files) {
    try {
        let error = []
        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return ["Please enter data to user registration"]

        //checks if fname is present
        if (!isValid(data.fname))
            error.push("first name is required")

        //checks if lname is present
        if (!isValid(data.lname))
            error.push("last name is required")

        //check if email is present
        if (!isValid(data.email))
            error.push("email is required")

        //check if image file is present
        if (!files || files.length == 0)
            error.push("image file is required")

        //checks if phone is present or not
        if (!isValid(data.phone))
            error.push("phone number is required")

        //check if password is present
        if (!isValid(data.password))
            error.push("password is required")


        //street is present 
        if (isValid(data.address)) {

            if (typeof data.address == "string")
                data.address = JSON.parse(data.address)

            let address = data.address

            if (isValid(address.shipping)) {
                if (!isValid(address.shipping.street))
                    error.push("shipping/street is required")

                //city is present 
                if (!isValid(address.shipping.city))
                    error.push("shipping/city is required")

                //pincode is present 
                if (!isValid(address.shipping.pincode))
                    error.push("shipping/pincode is required")
            }
            else error.push("shipping address is required")

            if (isValid(address.billing)) {
                //street is present 
                if (!isValid(address.billing.street))
                    error.push("billing/street is required")

                //city is present 
                if (!isValid(address.billing.city))
                    error.push("billing/city is required")

                //pincode is present 
                if (!isValid(address.billing.pincode))
                    error.push("billing/pincode is required")
            }
            else error.push("billing address is required")
        }
        else error.push("address is required")

        if (error.length > 0)
            return error;
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}



function isInvalid(data, getEmail, getPhone) {
    try {
        let error = []
        //checks for valid fname
        if (data.fname?.trim() && !(/^[a-zA-Z]+$/.test(data.fname)))
            error.push("enter a valid first name")

        //checks for valid lname
        if (data.lname?.trim() && !(/^[a-zA-Z]+$/.test(data.lname)))
            error.push("enter a valid last name")

        //validate email
        if (data.email?.trim() && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)))
            error.push("enter a valid email")
        //check for duplicate email
        if (getEmail)
            error.push("email is already in use")

        //check for image file
        if (files.length > 0 && !(/image\/[a-z]+/.test(files[0].mimetype)))
            error.push("upload a valid image file")

        //checks for valid phone number
        if (data.phone?.trim() && !(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(data.phone)))
            error.push("enter valid mobile number")
        //check unique phone number
        if (getPhone)
            error.push("mobile number is already in use")

        if (/[ ]+/.test(data.password?.trim()))
            error.push("enter valid password")
        //checks password length
        if (data.password?.trim() && (data.password.length < 8 || data.password.length > 15))
            error.push("password must have 8-15 characters")

        let address = data.address
        if (isValid(address)) {

            if (address.shipping) {

                if (address.shipping.city?.trim() && !(/^[a-zA-Z]+$/.test(address.shipping.city)))
                    error.push("enter a valid shipping/city name")

                if (address.shipping.pincode?.trim() && !(/^[1-9][0-9]{5}$/.test(address.shipping.pincode)))
                    error.push("enter a valid shipping/pincode")
            }

            if (address.billing) {

                if (address.billing.city?.trim() && !(/^[a-zA-Z]+$/.test(address.billing.city)))
                    error.push("enter a valid billing/city name")

                if (address.billing.pincode?.trim() && !(/^[1-9][0-9]{5}$/.test(address.billing.pincode)))
                    error.push("enter a valid billing/pincode")
            }
        }

        if (error.length > 0)
            return error;
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}


module.exports = { isRequired, isInvalid, isValid }