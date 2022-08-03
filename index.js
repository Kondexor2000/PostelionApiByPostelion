//Load .env config
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

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
knex('users')
  .select('id')
  .select('name')
  .select('last_logged')
  .then((data)=>{console.log(data);});


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(process.env.API_PORT, () => {
    console.log(`API RUN ON PORT: ${process.env.API_PORT}`)
  })