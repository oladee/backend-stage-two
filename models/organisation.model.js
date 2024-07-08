const { DataTypes}= require('sequelize');
const sequelize = require('../config/sequel')

const Organisation = sequelize.define('Organisation', {
    orgId : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING
    }

})

module.exports = Organisation