const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema =  new Schema({
  name : {type: String, required: true},
  email: {type: String, unique: true},
  password: {type: String}
});

const User = mongoose.model('User', userSchema);

module.exports = User;