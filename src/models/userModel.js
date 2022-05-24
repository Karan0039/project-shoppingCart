//IMPORTING MONGOOSE PACKAGE-----
const mongoose = require('mongoose')

// INSTANTIATE A MONGOOSE SCHEMA----

const userModel = new mongoose.Schema({
  fname: {type:String, required:true,trim:true},
  lname: {type:String, required:true,trim:true},
  email: {type:String, required:true,  unique:true,trim:true},
  profileImage: {type:String, required:true,trim:true}, // s3 link
  phone: {type:String, required:true, unique:true,trim:true}, 
  password: {type:String, required:true,  maxlength:15,minlength:8,trim:true}, // encrypted password
  address: {
    shipping: {
      street: {type:String, required:true,trim:true},
      city: {type:String, required:true,trim:true},
      pincode: {type:Number, required:true,trim:true}
    },
    billing: {
      street: {type:String, required:true,trim:true},
      city: {type:String, required:true,trim:true},
      pincode: {type:Number, required:true,trim:true}
    }
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
},  { timestamps: true })
 
module.exports = mongoose.model('user', userModel)