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

const UserRoutes=require('./routes/users');


app.use('/user',UserRoutes)

sequelize.sync( /* {force:true} */ )
.then(()=>{
    app.listen(process.env.PORT||3000);
}).catch(err=>console.log(err));