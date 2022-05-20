const config = require('./Config/config');

//APi Modules
const cv =require('./API/Postelion_Api/cv');


const express = require('express');
const { Pool, Client } = require('pg')
var cors = require('cors')
const app = express();
const port = 3001;

app.use(cors())

const pool = new Pool({
    user: config.dbConnection.username,
    host: config.dbConnection.host,
    database: config.dbConnection.dbname,
    password: config.dbConnection.password,
    port: config.dbConnection.port,
  });

  cv.start(app,pool);


app.listen(port, () => console.log(`Api Started ${port}!`))