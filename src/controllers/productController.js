const productModel = require("../models/productModel")
const { uploadFile } = require("../awsS3/aws")
const { isRequired, isInvalid, isValid } = require("../Validations/productValidation")

//1.
const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let getTitle = await userModel.findOne({ title: data.title })

        let error = []
        if (isRequired(data, files)) {
            let err = isRequired(data, files);
            error.push(...err)
        }
        if (isInvalid(data, getTitle)) {
            let err = isInvalid(data, getEmail, getPhone);
            error.push(...err)
        }
        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL
        data.availableSizes = availableSizes.toUpperCase();

        let created = await productModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//2.
const getProducts = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//3.
const getProductById = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//4.
const updateProduct = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//5.
const deleteProduct = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }