const express=require('express');

const messageControllers=require('../controllers/chat');
const userAuthentication=require('../middleware/authorization');

const router=express.Router();

router.post('/add-message/:groupId',userAuthentication.authenticate,messageControllers.sendMessage);

router.get('/get-message',messageControllers.getMessages);

router.post('/sendfile/:groupId',userAuthentication.authenticate,messageControllers.uploadFile);

module.exports=router;