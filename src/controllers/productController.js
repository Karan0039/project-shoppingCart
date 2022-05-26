const productModel = require("../models/productModel")
const { uploadFile } = require("../awsS3/aws")
const { isRequired, isInvalid, isValid } = require("../Validations/productValidation")
const mongoose=require("mongoose")
//1.
const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        let getTitle = await productModel.findOne({ title: data.title })

        let error = []
        if (isRequired(data, files)) {
            let err = isRequired(data, files);
            error.push(...err)
        }
        if (isInvalid(data, getTitle)) {
            let err = isInvalid(data, getTitle);
            error.push(...err)
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



//======================================================get Products from Query params===================================================================//

const getProducts = async (req, res) => {
    try {
        

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })

    }
}



//======================================================Get products by path params===================================================================//

const getProductById = async (req, res) => {

    try {
        const data = req.params.productId

        if (!mongoose.Types.ObjectId.isValid(data)) {
            return res.status(400).send({ status: false, message: "Invaild Product Id" })
        }
        //find the productId which is deleted key is false--
        let product = await productModel.findOne({ _id: data, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: "No Products Available!!" })
        }

        return res.status(200).send({ status: true, count: product.length, message: 'Success', data: product });
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}




//4.
const updateProduct = async function (req, res) {
    try {
        //write code here

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
        if (findProduct.isDeleted == true){
            return res.status(400).send({status:false, message:"product already deleted."})
        }

        const deletedDetails = await productModel.findOneAndUpdate(
            { _id: productId },
            { $set: { isDeleted: true, deletedAt: new Date() } }, {new:true})

        return res.status(200).send({ status: true, message: 'Product deleted successfully.', data:deletedDetails })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct }