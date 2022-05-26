const productModel = require("../models/productModel")
const { uploadFile } = require("../awsS3/aws")
const { isRequired, isInvalid, isValid } = require("../Validations/productValidation")
const { send } = require("express/lib/response")

//1.
const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let getTitle = await productModel.findOne({ title: data.title })
        let error = []
        let err1 = isRequired(data, files)
        if (err1) {
            error.push(...err1)
        }
        let err2 = isInvalid(data, getTitle, files)
        if (err2) {
            error.push(...err2)
        }
        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL

        data.price = parseFloat(parseFloat(data.price).toFixed(2))

        let created = await productModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



//2.
const getProducts = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//3.
const getProductById = async function (req, res) {
    try {
        //write code here

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//4.
const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        let data = req.body;
        let file = req.files;
        let err = isInvalid(data, file);
        if (err) {
            error.push(...err)
        }
        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        if (file.length > 0) {
            let uploadedFileURL = await uploadFile(file[0])
            data.prductImage = uploadedFileURL
        }
        let updatedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, [{ $addFields: data }], { new: true });
        if (!updatedProduct)
            return res.status(404).send({ status: false, message: "Product not found." })

        return res.status(200).send({ status: true, message: "Product details updated successfully.", data: updatedProduct })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//5.
const deleteProduct = async function (req, res) {
    try {
        const productId = req.body.productId
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "productId is invalid" });
        }

        const findProduct = await productModel.findById(productId);

        if (!findProduct) {
            return res.status(404).send({ status: false, message: 'product does not exists' })
        }
        if (findProduct.isDeleted == true) {
            return res.status(400).send({ status: false, message: "product already deleted." })
        }
        const deletedDetails = await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, message: 'Product deleted successfully.', data: deletedDetails })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }