const user = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const User = await user.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account updated successfully");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("you can only update your account!")
    }
});

//delete user
router.delete("/:id", async (req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            await user.deleteOne({_id:req.params.id});
            return res.status(200).json("Account deleted successfully");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("you can only delete your account!")
    }
});

//get user
router.get("/:id", async (req,res)=>{
    try{
        const User = await user.findById({_id:req.params.id});
        const {password, updatedAt, ...other} = User._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(404).json(err);
    }
});

//follow a user
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            const User = await user.findById(req.params.id);
            const currentUser = await user.findById(req.body.userId);
            if(!User.followers.includes(req.body.userId)){
                await User.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("followed " + User.username);
            }else{
                res.status(400).json("already followed");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Cant follow yourself");
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            const User = await user.findById(req.params.id);
            const currentUser = await user.findById(req.body.userId);
            if(User.followers.includes(req.body.userId)){
                await User.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("unfollowed " + User.username);
            }else{
                res.status(400).json("already unfollowed");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Cant unfollow yourself");
    }
});


module.exports = router 