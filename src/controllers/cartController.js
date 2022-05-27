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


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//4
const deleteCart = async function (req, res) {
    try {


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createCart, updateCart, getCart, deleteCart }