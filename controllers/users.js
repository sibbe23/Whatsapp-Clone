const User=require('../models/users');

const bcrypt=require('bcrypt');


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

            return res.status(400).json({message:"Bad parameters:Something is missing"})
        }
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        try{
            await User.create({username,email,number,password:hash}) 
        res.status(201).json({message:"Successfully Created New User"});
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
        res.status(500).json({
            message:err
        });
    }
}