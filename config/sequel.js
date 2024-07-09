const Sequelize = require('sequelize')
const pg = require('pg')
require('dotenv').config()

const sequelize = new Sequelize(process.env.SEQUEL,{
    dialectModule: pg
  })


module.exports = sequelize