const http = require('http');   //importing http for server
const app = require('./app');    //importing app.js
const port = process.env.PORT || 3000;

const server = http.createServer(app);  //instance of server

server.listen(port);