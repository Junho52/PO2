const mongoose = require('mongoose');

let Schema = mongoose.Schema

const Userschema = new Schema({ 
  username: String,
  password: String, 
  email:String,
  id: Number });

module.exports = mongoose.model('userschema', Userschema);