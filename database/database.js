const Sequelize=require('sequelize')

const connection=new Sequelize('guiapress','usuario','senha',{
    host:'localhost',
    dialect:'mysql',
    timezone:'-03:00'
})

module.exports = connection