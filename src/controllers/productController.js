const productModel = require("../models/productModel")
const { uploadFile } = require("../awsS3/aws")
const { isRequired, isInvalid, isValid } = require("../Validations/productValidation")
const { isValidObjectId } = require("mongoose")

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



//======================================================get Products from Query params===================================================================//

const getProducts = async (req, res) => {
    try {
        let reqParams = req.query

    let findProduct = await productModel.find({ isDeleted: false }).sort({ price: 1 })

    if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })

    if (findProduct) {
      return res.status(200).send({ status: true, message: "successfull", data: findProduct })
    }
  
    let { size, name, priceGreaterThan, priceLessThan } = reqParams

    if (size == "" || size) {
      if (!isValidSize(size)) return res.status(400).send({ status: false, message: "Not a valid size" })
    }

    if (name == "" || name) {
      if (!isValid(name)) return res.status(400).send({ status: false, message: "Not a valid name" })
    }

    if (priceGreaterThan == "" || priceGreaterThan) {
      if (!isValidNumber(priceGreaterThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
    }

    if (priceLessThan == "" || priceLessThan) {
      if (!isValidNumber(priceLessThan)) return res.status(400).send({ status: false, message: "Not a valid prize" })
    }

    // let result = { size, name, priceGreaterThan, priceLessThan, isDeleted: false }
    // name=name.toUpperCase()
    //console.log(name, typeof priceGreaterThan)
    priceGreaterThan = Number(priceGreaterThan)
    priceLessThan = Number(priceLessThan)
    let filterProduct = await productModel.find({ isDeleted: false, title: name, $or: [{ price: { $gt: priceGreaterThan } }, { price: { $lt: priceLessThan } }, { $and: [{price: {$gt: priceGreaterThan} }, { price:{$lt: priceLessThan} }] }] }).sort({ price: 1 })

    if (!filterProduct) return res.status(404).send({ status: false, message: "Product not found" })

    if (filterProduct) {
      return res.status(200).send({ status: true, message: "successfull", data: filterProduct })
    }

  }

    
    catch(error) {
        return res.status(500).send({ status: false, error: error.message })

    }
}



//======================================================Get products by path params===================================================================//

const getProductById = async (req, res) => {

    try {
        const data = req.params.productId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild Product Id" })
        }
        //find the productId which is deleted key is false--
        let product = await productModel.findOne({ _id: data, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: "No Products Available!!" })
        }
        return res.status(200).send({ status: true, count: product.length, message: 'Success', data: product })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}




//4.
const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        let data = req.body
        let file = req.files
        let error = []
        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "The given productId is not a valid objectId" })

        if(Object.keys(data).length==0||file.length==0)
            return res.status(400).send({status: false, message: "Please provide product detail(s) to be updated."})

        let err = isInvalid(data, file)
        if (err) {
            error.push(...err)
        }
        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        if (file.length > 0) {
            let uploadedFileURL = await uploadFile(file[0])
            data.prductImage = uploadedFileURL
        }
        let updatedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, [{ $addFields: data }], { new: true })
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