const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.SEQUEL)


module.exports = sequelize