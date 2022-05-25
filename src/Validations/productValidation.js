//check Validity
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidNum = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'number' && value.trim().length === 0) return false
    return true;
}

function isRequired(data, files) {
     try {
        let error = []

        //checks if user has given any data
        if (Object.keys(data).length == 0)
            return "Please enter data to user registration"

        //checks if title is present
        if (!isValid(data.title))
            error.push("title is required")

        //checks if description is present
        if (!isValid(data.description))
            error.push("description is required")

        //checks if price is present
        if (!isValidNum(data.price))
            error.push("price is required")

        //check if image file is present
        if (!files || files.length == 0)
            error.push("no file found")

        if (error.length > 0)
            return error;
    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}


function isInvalid(data, getTitle) {
    try {
        let error = []

        //check unique title
        if (getTitle)
            error.push("title is already in use")

        //checks for valid price
        if (data.price?.trim() && !(/^([0-9]+)?.?([0-9])+$/.test(data.price)))
            error.push("enter valid price")

        // //checks for valid currencyId
        // if (data.currencyId?.trim() && typeof data.currencyId !== "string")
        //     error.push("enter a valid currencyId")

        // //checks for valid currencyFormat
        // if (data.currencyFormat?.trim() && typeof data.currencyFormat !== "string")
        //     error.push("enter a valid currencyFormat")

        //checks for valid isFreeShipping
        // if (data.isFreeShipping?.trim() && typeof data.isFreeShipping !== "boolean")
        //     error.push("enter a valid isFreeShipping entry")

        //checks for valid availableSizes
        //let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        if (data.availableSizes) {
            data.availableSizes = JSON.parse(data.availableSizes);
            // for (let i in data.availableSizes) {
            //     if (!arr.includes(data.availableSizes[i])) {
            //         console.log(data.availableSizes[i])
            //         error.push("enter a valid availableSizes")
            //         break;
            //     }
            //} 
        }

        // //checks for valid installments
        // if (data.installments?.trim() && typeof data.installments !== "number")
        //     error.push("enter a valid installments")

        if (error.length > 0)
            return error;

    }
    catch (err) {
        console.log({ status: false, message: err.message })
    }
}


module.exports = { isRequired, isInvalid, isValid }