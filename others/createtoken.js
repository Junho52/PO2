const express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken');

app = module.exports = express.Router()

function createIdToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
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

function createAdminAccessToken() {          
  return jwt.sign({                        
    iss: config.issuer,                     
    aud: config.audience,                   
    exp: Math.floor(Date.now() / 1000) + (20), // 1초 단위
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

function getUserScheme(req) {  
  
  let username;
  let type;
  let userSearch = {};
                      
  if(req.body.username) {             
    username = req.body.username;    
    type = 'username';               
    userSearch = { username: username };
  }

  else if(req.body.email) {       
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

app.post('/sessions/login', function(req, res) {   

  let userScheme = getUserScheme(req);   

  if (!userScheme.username || !req.body.password) {  
    return res.status(400).send("You must send the username and the password");
  }

  let user = _.find(users, userScheme.userSearch);  
  //_.find => lodash 메서드 (users 안에서 뒤의 조건에 부합하는 첫번째 결과물을 반환)
  if (!user) {                                      
    return res.status(401).send("The username or password don't match");
  }

  if (user.password !== req.body.password) {        
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({ 
    id_token: createIdToken(user),
    access_token: createAccessToken()
  });
});

app.post('/sessions/Adminlogin', function(req, res) {   

  let userScheme = getUserScheme(req);   

  if (!userScheme.username || !req.body.password) {  
    return res.status(400).send("You must send the username and the password");
  }

  let user = _.find(users, userScheme.userSearch);  
  //_.find => lodash 메서드 (users 안에서 뒤의 조건에 부합하는 첫번째 결과물을 반환)
  if (!user) {                                      
    return res.status(401).send("The username or password don't match");
  }

  if (user.password !== req.body.password) {        
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({ 
    id_token: createIdToken(user),
    access_token: createAdminAccessToken()
  });
});