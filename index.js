//Load .env config
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(process.env.API_PORT, () => {
    console.log(`API RUN ON PORT: ${process.env.API_PORT}`)
  })