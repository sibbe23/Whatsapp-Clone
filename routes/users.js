const express=require('express');

const userControllers=require('../controllers/users.js');

const router=express.Router();

router.post('/signup',userControllers.addUsers);

module.exports=router;