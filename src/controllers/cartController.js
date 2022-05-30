const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValidObjectId } = require("mongoose")

//1
const createCart = async function (req, res) {
    try {


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//2
const updateCart = async function (req, res) {
    try {


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