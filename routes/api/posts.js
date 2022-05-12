const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/user');
const Post = require('../../schemas/PostSchema');

app.use(bodyParser.urlencoded({extended: false}));

router.get("/", async (req,res,next)=>{  

     // Post.find()
     // .populate("postedBy")
     // .populate("retweetData")
     // .sort({"createdAt": -1})
     // .then(async(results)=>{
     //     //console.log(results);
     //      results = await User.populate(results, {path: "retweetData.postedBy"})
     //      res.status(200).send(results);
     // })
     // .catch((err)=>{
     //      console.log(err);
     //      res.send(400);
     // })

     var results = await getPosts({});
     res.status(200).send(results);
})

router.get("/:id",async (req,res,next)=>{   
     var postId = req.params.id;
     var results = await getPosts({_id: postId});
     var results = results[0];
     res.status(200).send(results); 
     //return res.status(200).send('it workss');

})

router.post("/",async (req,res,next)=>{  

     if (!req.body.content){
          console.log("content param is not sent or invalid ");
          return res.sendStatus(400);
     }

     var postData = {
          content: req.body.content,
          postedBy: req.session.user
     }

     if(req.body.replyTo){
          postData.replyTo = req.body.replyTo;
     }

     
     //console.log("Post Data : " + postData)
     Post.create(postData)
     
     .then(async newPost =>{
          newPost = await User.populate(newPost, {path: "postedBy"})
          res.status(201).send(newPost);
     })
     .catch(err=>{
         console.log(err);
         res.sendStatus(400); 
     })
})

router.put("/:id/like",async (req,res,next)=>{  
     var postId = req.params.id;
     var userId = req.session.user._id;

     var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
     var option = isLiked ? "$pull" : "$addToSet";
     //console.log("Is liked" + isLiked);

     req.session.user = await User.findByIdAndUpdate(userId,{ [option]: {likes: postId} },{new: true})
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })
     
     //Insert user like
     
     var post = await Post.findByIdAndUpdate(postId,{ [option]: {likes: userId} },{new: true})
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })

     res.status(200).send(post);
})


router.post("/:id/retweet",async (req,res,next)=>{  

     var postId = req.params.id;
     var userId = req.session.user._id;

     //Try and delete retweet

     var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData : postId })
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })

     //var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
     var option = deletedPost ? "$pull" : "$addToSet";
     //console.log("Is liked" + isLiked);

     var repost = deletedPost;

     if(repost == null){
          repost = await Post.create({ postedBy: userId, retweetData: postId})
          .catch(err=>{
               console.log(err);
               res.sendStatus(400);
          })
     }

     req.session.user = await User.findByIdAndUpdate(userId,{ [option]: {retweets: repost._id} },{new: true})
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })

     req.session.user = await User.findByIdAndUpdate(userId,{ [option]: {likes: postId} },{new: true})
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })
     
     //Insert user like
     
     var post = await Post.findByIdAndUpdate(postId,{ [option]: {retweetUsers: userId} },{new: true})
     .catch(err=>{
          console.log(err);
          res.sendStatus(400);
     })

     res.status(200).send(post);
})

async function getPosts(filter){
     var results = await Post.find(filter)
     .populate("postedBy")
     .populate("retweetData")
     .populate("replyTo")
     .sort({"createdAt": -1})
     .catch((err)=>{console.log(err); })

     results = await User.populate(results, {path: "replyTo.postedBy"});

     return await User.populate(results, {path: "retweetData.postedBy"});
}

module.exports = router;