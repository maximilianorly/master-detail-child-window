const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Determine the environment
const environment = process.env.NODE_ENV || 'development';

// Load the appropriate .env file based on the environment
const envFilePath = path.resolve(__dirname, `.env.${environment}`);
dotenv.config({ path: envFilePath });

const envVars = process.env;

const app = express();
const port = envVars.PORT;

app.use(express.static('public'));


const BASE_URL = environment === 'development' ? `${envVars.BASE_URL}:${envVars.PORT}` : `${envVars.BASE_URL}`

const publicEnvVars = {
  BASE_URL: BASE_URL
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/public-env.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send(`var publicEnvVars = ${JSON.stringify(publicEnvVars)};`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});