const Group=require('../models/group');
const Usergroup=require('../models/usergroup');
const Chat=require('../models/chat');
const User = require('../models/users');

exports.createGroup=async(req,res,next)=>{
    try{
        const {groupname}=req.body;
        console.log(">>>>>>>>>>",groupname)
        if(groupname===undefined||groupname.length===0){
                return res.status(200).json({message:"SomeThing is Missing",success:false})
        }
    const group = await Group.create({groupname:groupname})
    console.log(req.user.id);
    console.log("???????????",group.id);

    const usergroup = await Usergroup.create({isadmin:true,groupId:group.id,userId:req.user.id});
    res.status(200).json({message:group,success:true,username:req.user.username})


    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})

    }
}

exports.getAllGroups=async(req,res,next)=>{
    try{
    const groupList = await Group.findAll();
    res.status(200).json({message:groupList,success:true})

    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})

    }
}

exports.getGroupMembers=async(req,res,next)=>{

    try{
        const groupId=+req.query.groupId;
       const usergroup= await Usergroup.findOne({
        where:{groupId:groupId},
        attributes:['userId']
    })
    const userId=usergroup.dataValues.userId;
    console.log(userId);
    const username=await User.findOne({
        where:{id:userId},
        attributes:['username']
    })
        const groupMembers = await Chat.findAll({
            where:{groupId:groupId},
            attributes:['username'],
            distinct:true,
            group:['groupId','username']
        })
        res.status(200).json({message:groupMembers,success:true,username:username})

    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }  

}


exports.deleteGroup=async(req,res,next)=>{

    try{
        const groupId=+req.query.groupId;
        
        const isadmin=await Usergroup.findOne({where:{groupId:groupId,isadmin:true,userId:req.user.id}})
        // console.log(isadmin)
        await Group.destroy({where:{id:groupId}})
        await Chat.destroy({where:{id:groupId}})
        res.status(200).json({message:"Deleted Group Successfully ",success:true})

    }catch(err){
        console.log(">>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false,error:err})
    }  

}

exports.makeadmin=async(req,res)=>{
    try{
        const groupId = +req.query.groupId;
        console.log(groupId)
        const userId = +req.query.userId;
        console.log(userId)
            const groupMember = await Usergroup.findOne({
                where:{groupId:groupId,userId:userId}
            })
            if(groupMember===null){
                await Usergroup.update({isadmin:true},
                    {where:{groupId:groupId,userId:'2'}})
            }
            else{
                throw new Error('Only Admins can grant admin access')
            }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Something went Wrong",success:false,error:err})

    }
}