const mongoose = require('mongoose');
require("dotenv").config();
const Sequelize = require('sequelize');

// //mongodb connection
mongoose.connect(process.env.connection, {useNewUrlParser:true},() =>
console.log('mongo connected')
)

//mysql connection
const sequelize = new Sequelize(
    process.env.mysqlDB,
    process.env.mysqlUSER,
    process.env.mysqlPASSWORD,
    {
        host: process.env.mysqlHOST,
        dialect: process.env.mysqldialect,
        operatorAliases: false,
    }
);
sequelize.authenticate()
.then(() => {
    console.log('mysql Connected');
}).catch((err) => {
    console.log(err);
});

module.exports = sequelize
