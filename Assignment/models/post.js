const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema =  new Schema({
  title : {type: String, required: true},
  body: {type: String},
  image: {type: String},
  user: {type: ObjectId, ref: "User"}
});

const Post = mongoose.model('Blog', postSchema);

module.exports = Post;