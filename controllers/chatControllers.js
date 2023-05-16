const Message = require("../models/message")
const { Op } = require("sequelize")
const AWS=require('aws-sdk');
const User = require('../models/user')



exports.postChat = async (req, res) => {
    try {
        const user = req.user
        const { message, groupId } = req.body
        if (message === "") {
            return res.status(401).json({ message: "invalid message", success: "false" })
        }
        const newMessage = await user.createMessage({ message: message, groupId: groupId, sender: req.user.name })
        res.status(200).json({ success: "true", name: user.name, message: newMessage.message, })
    } catch (error) {
        res.status(500).json({ success: "false", error })
    }
}

exports.fetchChat = async (req, res) => {
    try {
        const lastChatId = +req.params.lastId
        const chat = await Message.findAll({ where: { id: { [Op.gt]: lastChatId } } })
        if (chat.length == 0) {
            return res.status(200).json({ message: "chat up to date", chat: [] })
        }
        res.status(200).json({ message: "fetch success", chat, lastChatId: chat[chat.length - 1].id })
    } catch (error) {
        res.status(500).json({ success: "false", message: "chat fetch error" })
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
        const file = req.files.file
        const fileName = file.name;
        const fileURL= await uploadToS3(file);
        const user = await Message.create({message:fileURL,sender:fileName});
        res.status(200).json({message:user,success:true})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Something went Wrong",err:err,success:false})
    }
}