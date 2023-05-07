
const express=require('express');

const app=express();

const cors=require('cors');

const bodyParser=require('body-parser');

require('dotenv').config();

const fileupload=require('express-fileupload');

app.use(fileupload());


app.use(cors({
    origin:"*"
}));


const io = require('socket.io')(8000,{
    cors: {
        origin: '*',
      }
});

io.on('connection', socket => {
    socket.on('send-message', room => {
        console.log(room);
        io.emit('receive-message', room);
    });
})

app.use(bodyParser.json({extended:false}));

const path = require('path');

const sequelize=require('./util/database');

const User=require('./models/users');

const Chat=require('./models/chat');

const Group=require('./models/group')

const UserGroup=require('./models/usergroup');

const UserRoutes=require('./routes/users');

const MessageRoutes=require('./routes/chat');

const GroupRoutes=require('./routes/group');


User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group,{through :UserGroup}); 
Group.belongsToMany(User,{through :UserGroup});

Group.hasMany(Chat);
Chat.belongsTo(Group);


app.use('/user',UserRoutes);
app.use('/chat',MessageRoutes);
app.use('/group',GroupRoutes);


app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})

app.use('/',(req,res,next)=>{
    res.status(404).send("<h1>OOPS! Page Not Found </h1>");
})


sequelize.sync(/*{force:true}*/ )
.then(()=>{
    app.listen(3000);
}).catch(err=>console.log(err));