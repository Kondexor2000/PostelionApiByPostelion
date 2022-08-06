//Load .env config
const dotenv = require('dotenv');
dotenv.config();

//Config express
const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors({ origin: '*'}));


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

module.exports.db = knex;

//Load Modules
const user = require('./modules/user');
const credentials = require('./modules/credentials');
const modules = require('./modules/modules');
const cv = require('./modules/cv');
const projects = require('./modules/projects');
const messages = require('./modules/messages');

//Start Modules
app.use('/user', user);
app.use('/credentials',credentials);
app.use('/modules',modules);
app.use('/cv',cv);
app.use('/projects',projects);
app.use('/messages',messages);


  
//Run Express
app.listen(process.env.API_PORT, () => {
    console.log(`API RUN ON PORT: ${process.env.API_PORT}`)
})