const userModel = require("../models/userModel")
const jwt=require("jsonwebtoken")


const authentication = function (req, res, next) {
    try {



    } catch (err) {
        return res.status(500).send({ error: err.message })
    }
}

module.exports={authentication}