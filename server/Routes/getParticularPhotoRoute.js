const express =require('express');  
const { getParticularPhoto, getPostById }=require('../Model/postModel');
const router=express.Router();

router.get('/post/:post_id',async(req,res)=>{
    const post_id=req.params.post_id;
    const post=await getPostById(post_id);
    res.json(post);
});

module.exports=router;