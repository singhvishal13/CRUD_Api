const express = require('express');
const bodyParser = require('body-parser');
const middleWare = require('./middleware/user')
const userRoute = require('./routes/user');
const morgan = require('morgan');   //to get logs at console
const app = express();


app.use(morgan('dev'));     //console logger middleware
app.use(bodyParser.urlencoded({extended: false}));  //to parse the url returned errors or data
app.use(bodyParser.json());
//adding header with the response in case of CORS error
app.use(middleWare.corsHandle);

//router handeling

app.use('/', userRoute);

//error handleing
app.use(middleWare.error400);
app.use(middleWare.error500);

module.exports = app;

