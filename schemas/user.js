const mongoose = require('mongoose');

const schema = mongoose.Schema;
const UserSchema = new schema({
     firstName:{
          type: String,
          required: true,
          trim: true,
     },
     lastName:{
          type: String,
          required: true,
          trim: true,
     },
     email:{
          type: String,
          required: true,
          trim: true,
          unique: true
     },
     username:{
          type: String,
          required: true,
          trim: true,
          unique: true
     },
     password:{
          type: String,
          required: true,
     },
     profilePic:{
          type: String,
          default: "/images/profilePic.png",
     },
     likes: [{ type: schema.Types.ObjectId, ref: 'Post'}],
     retweets: [{ type: schema.Types.ObjectId, ref: 'Post'}]
     
},{timestamps: true})

var User = mongoose.model("User",UserSchema);
module.exports = User;