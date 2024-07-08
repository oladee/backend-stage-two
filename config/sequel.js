const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('postgresql://postgres.yxujjjoqevkarjjiqxcq:BAMIdele1@.@aws-0-eu-central-1.pooler.supabase.com:6543/postgres')


module.exports = sequelize