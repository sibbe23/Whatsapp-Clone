const Chat=require('../models/chat');

const User=require('../models/users');

const AWS=require('aws-sdk');

exports.sendMessage=async (req,res,next)=>{
    try{
        const groupId=req.params.groupId;
        const {message}=req.body;
        const{username}=req.user;
        if(message.length===0||message===undefined){
            return res.status(500).json({message:"Something is missing",success:false})
        }
      const user = await req.user.createChat({username:username,message:message,groupId:groupId});
       res.status(200).json({message:user,success:true})
    }catch(err){
        console.log(">>>>>>>>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",error:err,success:false})
    }
}

exports.getMessages=async(req,res,next)=>{
try{
    const lastmsgId=+req.query.lastmsgId||0;
    const groupId=+req.query.groupId;
    console.log(lastmsgId);
    const  messages = await Chat.findAll({
       where:{groupId:groupId},
       offset:lastmsgId,
       limit:10
    });
         res.status(200).json({message:messages,success:true})
}catch(err){
    console.log(">>>>>>>>>>>>>>>",err);
    res.status(500).json({message:"Something went Wrong",success:false})
}
}


function uploadToS3(file){

    const BUCKET_NAME= process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY= process.env.AWS_KEY_ID;
    const  IAM_USER_SECRET= process.env.AWS_SECRET_KEY;

    let s3bucket=new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    })
     var params={
            Bucket:BUCKET_NAME,
            Key:file.name,
            Body:file.data,
            ContentType:file.mimetype,
            ACL:'public-read'
        }
       return new Promise((resolve, reject) => {
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("SOMETHING WENT WRONG",err)
                    reject(err);
                } 
                else{
                    resolve(s3response.Location)
                    }
                })
       })      


}
exports.uploadFile=async(req,res,next)=>{
    try{
        const groupId=req.params.groupId;

        console.log(">>>>>>>",req.files.file);
        const file=req.files.file;
        const fileName=file.name;
        const fileURL= await uploadToS3(file);
        console.log(fileURL);
        const user = await req.user.createChat({username:req.user.username,message:fileURL,groupId:groupId});
        res.status(200).json({message:user,success:true})
        
        
    }catch(err){
        console.log(">>>>>>>>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",error:err,success:false})
    }
}