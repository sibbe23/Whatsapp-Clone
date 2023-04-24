
const express=require('express');

const app=express();

const cors=require('cors');

const bodyParser=require('body-parser');

require('dotenv').config();



app.use(cors({
    origin:"*"
}));

app.use(bodyParser.json({extended:false}));

const sequelize=require('./util/database');

const User=require('./models/users');

const Chat=require('./models/chat');

const UserRoutes=require('./routes/users');

const MessageRoutes=require('./routes/chat');

User.hasMany(Chat);
Chat.belongsTo(User);

app.use('/user',UserRoutes);
app.use('/chat',MessageRoutes);

sequelize.sync( /* {force:true} */ )
.then(()=>{
    app.listen(process.env.PORT||3000);
}).catch(err=>console.log(err));