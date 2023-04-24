const Chat=require('../models/chat');

exports.sendMessage=async (req,res,next)=>{
    try{
        const {message}=req.body;
        const{username}=req.user;
        if(message===''){
            return res.status(500).json({message:"Something is missing"})
        }
      const user = await req.user.createChat({username:username,message:message})
       res.status(200).json({message:user})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went Wrong"})
    }
}

exports.getMessages=async(req,res,next)=>{
try{
    const lastmsgId=+req.params.lastmsgId||0;
    // console.log(lastmsgId);
    const  messages = await Chat.findAll({
       offset:lastmsgId,
       limit:10
    });
         res.status(200).json({message:messages})
}catch(err){
    console.log(err);
    res.status(500).json({message:"Something went Wrong"})
}
}