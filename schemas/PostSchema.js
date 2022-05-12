const mongoose = require('mongoose');

const schema = mongoose.Schema;
const PostSchema = new schema({
     content:{type: String, trim: true},
     postedBy: { type: schema.Types.ObjectId, ref: 'User'},
     pinned: Boolean,
     likes: [{ type: schema.Types.ObjectId, ref: 'User'}],
     retweetUsers: [{ type: schema.Types.ObjectId, ref: 'User'}],
     retweetData: { type: schema.Types.ObjectId, ref: 'Post'},
     replyTo: { type: schema.Types.ObjectId, ref: 'Post'}

},{timestamps: true})

var Post = mongoose.model("Post",PostSchema);
module.exports = Post;