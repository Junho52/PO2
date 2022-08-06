const express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');
    cookieParser = require('cookie-parser')
    usersearching = require('./usersearching');

let app = module.exports = express.Router()

app.use(cookieParser());

function createIdToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

function getUserScheme(req) { //req의 user 정보를 객체로 만들어 메모리에 저장

  let username;
  let type;
  let userSearch = {};

  if (req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }

  else if (req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

function createAccessToken() {          
  return jwt.sign({                        
    iss: config.issuer,                     
    aud: config.audience,                   
    exp: Math.floor(Date.now() / 1000) + (20),
    //scope: 'full_access',               
    authLevel : 1,
    sub: "lalaland|gonto",                 
    jti: genJti(), 
    alg: 'HS256' 
  }, config.secret); 
}

function createPowerAccessToken() {          
  return jwt.sign({                        
    iss: config.issuer,                     
    aud: config.audience,                   
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    //scope: 'full_access',               
    authLevel : 2,
    sub: "lalaland|gonto",                 
    jti: genJti(), 
    alg: 'HS256' 
  }, config.secret); 
}

function genJti() { 
  let jti = '';     
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';  
  for (let i = 0; i < 16; i++) {                              
      jti += possible.charAt(Math.floor(Math.random() * possible.length)); 
  }                                                                       
  return jti;
}

app.post('/login', async (req, res) => {   

  let getuserScheme = getUserScheme(req);
  
  let userdatas = [{}]
  userdatas = await usersearching.all(); 

  if (!getuserScheme.username || !req.body.password) {  
    return res.status(400).send("You must send the username and the password");
  }

  let user = _.find(userdatas, getuserScheme.userSearch);
  
  let thisuser = {
    username: user.username,
    password: user.password,
    id: user.id
  }
  
  if (!user) {                                      
    return res.status(401).send("The username or password don't match");
  }

  if (user.password !== req.body.password) {        
    return res.status(401).send("The username or password don't match");
  }

  try {
    const result = { 
    id_token: createIdToken(thisuser),
    access_token: createAccessToken()
  }
    res.status(201).cookie('mycookie', result);
    res.status(201).send('success');
  }
    
  catch(ex) {  
    console.error(ex);
  }
});