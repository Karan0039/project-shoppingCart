const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValidObjectId } = require("mongoose")
const { createIndexes } = require("../models/userModel")

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//1
const createCart = async function (req, res) {
    try{
        let userId=req.params.userId
        const {productId,cartId,quantity}= req.body
        
        if (!isValidObjectId(userId)){
        return res.status(400).send({ status: false, message: "USER ID is Not Valid" });
        }
        if (Object.keys(req.body).length == 0) {
         return res.status(400).send({ status: false, message: "Field can't not be empty.Please enter some details" });
        }
        // if (!isValidObjectId(productId)){
        //     return res.status(400).send({ status: false, message: "PRODUCT ID is Not Valid" });
        // } 
        // if (!isValidObjectId(cartId)){
        //     return res.status(400).send({ status: false, message: "CART ID is Not Valid" });
        // }
        
        
        const findUserDetails = await userModel.findOne({ _id: userId })
        if (!findUserDetails) {
          return res.status(404).send({ status: false, message: "USER Not Found" });
        }
        const findProductDetails = await productModel.findOne({ _id: productId ,isDeleted:false}).select({_id:0,price:1})
        let price=findProductDetails.price
        
        if (!findProductDetails) {
          return res.status(404).send({ status: false, message: "PRODUCT Not Found" });
        }
        
        if(quantity==0)return res.status(400).send({message:"Quantity should not be zer0"})
        const findCart= await cartModel.findOne({ userId: userId })
        
        console.log(price* quantity)
        
        let product={
            productId:productId,
            quantity:quantity
        }
        if(findCart){
        
        await cartModel.findOneAndUpdate({userId:userId},{$addToSet:{items:product},$inc: { totalPrice:price* quantity,totalItems: quantity }} ,{new:true})
        }
        //console.log(findCart)
        
        let data={
            userId:userId ,
          items: [{
            productId:productId, 
            quantity: quantity
          }],
          totalPrice:price* quantity,
          totalItems:quantity
        }
        
        if(!findCart){
        let createdCart = await cartModel.create(data)
        res.status(201).send({Msg:"Working",data:createdCart})
        }
        else {
            res.status(200).send({msg:findCart})
        }
        
            }catch(err){
                res.send({message:err.message})
            }
        
}


//2
const updateCart = async function (req, res) {
    try {
        let data = req.body
        let error = []
        if (Object.keys(data).length == 0)
            return res.status(404).send({ status: false, message: "Please enter data to update cart details" })

        if (!isValidObjectId(data.cartId))
            error.push("invalid cartId")
        if (!isValidObjectId(data.productId))
            error.push("invalid productId")
        if (!isValid(data.removeProduct))
            error.push("removeProduct is required")
        if (data.removeProduct?.trim() && !(data.removeProduct == 0 || data.removeProduct == 1))
            error.push("removeProduct accepts either 0 or 1")

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        let cart = await cartModel.findOne({ _id: data.cartId, userId: req.params.userId, isDeleted: false })
        if (!cart)
            return res.status(404).send({ status: false, message: "Cart not found" })

        let indexOfProduct = cart.items.map(object => object.productId).indexOf(data.productId)
        let quantity = cart.items[indexOfProduct].quantity
        if (indexOfProduct == -1)
            return res.status(404).send({ status: false, message: "Product not found inside cart" })

        let product = await productModel.findOne({ _id: data.productId, isDeleted: false })
        if (!product)
            return res.status(404).send({ status: false, message: "Product not found" })

        switch (data.removeProduct) {
            case 0:
                cart.items[indexOfProduct] = ""
                cart.items = cart.items.filter(x => x)
                cart.totalItems = cart.items.length
                cart.totalPrice -= product.price * quantity
                break;
            case 1:
                --cart.items[indexOfProduct].quantity
                cart.totalItems = cart.items.length
                cart.totalPrice -= product.price
                break;
        }

        await cart.save();
        return res.status(200).send({ status: true, message: "Updated cart details", data: cart })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//3
const getCart = async function (req, res) {
    try {
        let cart = await cartModel.find({ userId: req.params.userId, isDeleted: false })
        if (!cart)
            return res.status(404).send({ status: false, message: "Cart not found." })
        return res.status(200).send({ status: true, message: "Cart details", data: cart })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//4
const deleteCart = async function (req, res) {
    try {
        let cart = await cartModel.findOneAndUpdate({ userId: req.params.userId, isDeleted: false }, { isDeleted: true, deletedAt: new Date(), items: [], totalItems: 0, totalPrice: 0 })
        if (!cart)
            return res.status(404).send({ status: false, message: "Cart not found." })

        return res.status(204).send({ status: true, message: "Cart deleted successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart, updateCart, getCart, deleteCart }