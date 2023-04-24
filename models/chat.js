const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Chat= sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
      },
      username:{
        type:Sequelize.STRING,
        allowNull:false
      },
  message:{
    type:Sequelize.STRING,
    allowNull:false
  }
});
module.exports=Chat;