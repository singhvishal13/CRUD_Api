const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/config')
const mysqlUser = sequelize.define("mysqluser", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.TEXT,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt:{
        type: DataTypes.DATE,
        allowNull: true
    },
    image:{
        type:DataTypes.STRING
    }
})
sequelize.sync({force: false})
.then(() => {
    console.log('Drop and re-sync db.');
});

module.exports = mysqlUser