const productModel = require("../models/productModel")

//1.
const createProduct = function (req, res) {
    try {
        let data = req.body
        let files = req.files

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

        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL

        let created = await productModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//2.
const getProducts = function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//3.
const getProductById = function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//4.
const updateProduct = function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//5.
const deleteProduct = function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }