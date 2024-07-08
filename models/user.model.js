const { DataTypes}= require('sequelize');
const sequelize = require('../config/sequel')
const Organisation = require('./organisation.model')

const User = sequelize.define('User',{
    userId : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique : true
    },
    firstName : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    lastName : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    email : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    password : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    phone : {
        type : DataTypes.STRING,
    }
})

const userOrganisation = sequelize.define('userOrganisation',{
    UserId : {
        type : DataTypes.UUID,
        references : {
            model : 'User',
            key : 'id'
        }
    },
    OrganisationId : {
        type : DataTypes.UUID,
        references : {
            model : 'Organisation',
            key : 'id'
        }
    },
})


User.belongsToMany(Organisation, {through : userOrganisation})
Organisation.belongsToMany(User, {through : userOrganisation})


module.exports = User