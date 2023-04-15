const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/user");

//create post
router.post("/", async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(400).json(err);
    }
});

//update post
router.put("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("The post has been updated");
        }else{
            res.status(400).json("Can't update post");
        }
    }catch(err){
        res.status(400).json(err);
    }
});

//delete post
router.delete("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        }else{
            res.status(400).json("Can't delete post");
        }
    }catch(err){
        res.status(400).json(err);
    }
});

//like/dislike a post
router.put("/:id/like", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("Liked");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("disLiked");
        }
    }catch(err){
        res.status(400).json(err);
    }
});

//get a post
router.get("/:id", async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

//get feed
router.get("/feed/all", async (req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendposts = await Promise.all(
            currentUser.followings.map((friend)=>{
                return Post.find({userId:friend});
            })
        );
        res.status(200).json(userPosts.concat(...friendposts));
    }catch(err){
        res.send(500).json(err);
    }
})

module.exports = router;