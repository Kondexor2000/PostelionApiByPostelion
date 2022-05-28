const config = require('./Config/config');
const bodyParser = require('body-parser');

//APi Modules
const cv = require('./API/Postelion_Api/cv');
const user = require('./API/Postelion_Api/user');
const services = require('./API/Postelion_Api/services');
const modules = require('./API/Postelion_Api/modules');
//Other Modules API
// const F1_Api = require('./API/Postelion');

const express = require('express');
const { Pool, Client } = require('pg')
var cors = require('cors')
const app = express();
const port = 3001;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
    user: config.dbConnection.username,
    host: config.dbConnection.host,
    database: config.dbConnection.dbname,
    password: config.dbConnection.password,
    port: config.dbConnection.port,
    max:100,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
  });

  cv.start(app,pool);
  user.start(app,pool);
  services.start(app,pool);
  modules.start(app,pool);


app.listen(port, () => console.log(`Api Started ${port}!`))