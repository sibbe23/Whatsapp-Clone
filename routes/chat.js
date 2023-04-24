const express=require('express');

const messageControllers=require('../controllers/chat');
const userAuthentication=require('../middleware/authorization');

const router=express.Router();

router.post('/add-message',userAuthentication.authenticate,messageControllers.sendMessage);

router.get('/get-message/:lastmsgId',messageControllers.getMessages);
module.exports=router;