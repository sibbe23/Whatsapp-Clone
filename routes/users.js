const express=require('express');

const userControllers=require('../controllers/users');

const router=express.Router();

router.post('/signup',userControllers.addUsers);

router.post('/login',userControllers.login);

router.get('/getall',userControllers.getAll)


module.exports=router;