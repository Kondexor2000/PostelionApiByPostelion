//Load .env config
const dotenv = require('dotenv');
dotenv.config();

//Config express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))

//Configure connection to DB
const knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : process.env.DB_ADDRESS,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  }
});

//Load Modules
const user = require('./modules/user');
const credentials = require('./modules/credentials');

//Start Modules
user.startApi(app,knex,'/user');
credentials.startApi(app,knex,'/credentials');



  
//Run Express
app.listen(process.env.API_PORT, () => {
    console.log(`API RUN ON PORT: ${process.env.API_PORT}`)
})