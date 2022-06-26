const Sequelize=require('sequelize')
const connection=require('../database/database')


const Category=connection.define('categories',{
    title:{
        type:Sequelize.STRING,
        allownull:false},
    slug:{
        type:Sequelize.STRING,
        allownull:false
    }    
})


module.exports=Category
