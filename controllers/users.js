const User=require('../models/users');

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');


function isStringInvalid(string){
    if(string==undefined ||string.length===0){
        return true;
    }
    else{
        return false;
    }
}

exports.addUsers=async(req,res,next)=>{
    try{  
       /*  console.log(req.body); */
    const{username,email,number,password}=req.body;
   
        if(isStringInvalid(username)||isStringInvalid(email)||
        isStringInvalid(number)||isStringInvalid(password)){

            return res.status(400).json({message:"Bad parameters:Something is missing",success:false})
        }
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        try{
            await User.create({username,email,number,password:hash}) 
        res.status(201).json({message:"Successfully Created New User",success:true});
        }
        catch(err){
        if(err.name="SequelizeUniqueConstraintError"){
           err="User Already Exists!  Please Login";
        } 
        else{
        err="OOPS! Something Went wrong";
        }
            res.status(500).json({
                message:err
            });
        }  
    })
    }
    catch(err){
        /* console.log(err); */
        res.status(500).json({ message:"Something went Wrong" ,error:err,success:false });
    }
}
function generateAccessToken(id,name){

    return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET);

 }                                 

exports.login= async (req,res,next)=>{
    try{
        const{email,password}=req.body;
        if(isStringInvalid(email)||isStringInvalid(password)){

            return res.status(400).json({message:"Bad parameters:Something is missing"})
        }

        const user= await User.findAll({where:{email:email}});
        //console.log(user);
        if(user.length>0)
        {
        bcrypt.compare(password,user[0].password,(err,result)=>{
            if(err){
              throw new Error("Something Went Wrong");
            }
            if(result===true){
                return res.status(200).json({success:true,token:generateAccessToken(user[0].id,user[0].username)});
            }
                else{
                return res.status(400).json({success:false,message:"Password is invalid"});
             }
        })   
        }
        else{
            return res.status(404).json({success:false,message:"User does Not Exist"});
        }
    }catch(err){
        return res.status(500).json({success:false,message:err});
    }     
    }

    exports.getAll=async(req,res)=>{
        const user =await User.findAll()
        res.send(user)
        // console.log(user)
    }