const Sequelize = require('sequelize')
import pg from 'pg';
require('dotenv').config()

const sequelize = new Sequelize(process.env.SEQUEL,{
    dialectModule: pg
  })


module.exports = sequelize