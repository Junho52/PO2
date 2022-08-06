const express    = require('express'),
      jwt_decode = require('jwt-decode');
      config     = require('../config.json');

app = module.exports = express.Router()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/webpage/index.html')
})

app.get('/registerpage', (req, res) => {
  res.sendFile(__dirname + '/webpage/register.html')
})

app.get('/loginpage', (req, res) => {
  res.sendFile(__dirname + '/webpage/login.html')
})

app.get('/main', (req, res) => {
  
  if (!req.cookies.mycookie) {
    return res.status(401).send('The token does not exist.');
  }

  let token = req.cookies.mycookie.access_token;

  let decoded = jwt_decode(token);

  if (decoded.iss !== config.issuer || decoded.aud !== config.audience) {
    return res.status(401).send('The token could not be validated.');
  }
  else if (decoded.iss === config.issuer && decoded.aud === config.audience) {
    return res.sendFile(__dirname + '/webpage/main.html')
  }
})