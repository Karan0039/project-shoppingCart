const express = require('express')
const bodyParser = require('body-Parser')
const route = require('./routes/routes.js')
const { default: mongoose } = require('mongoose')
const app = express()
const multer= require("multer")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use( multer().any())


mongoose.connect("mongodb+srv://FunctionUp:heeheehee123@cluster0.ambyf.mongodb.net/group38Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 3000, function (){
    console.log('Express app running on port: ' + (process.env.PORT || 3000))
})