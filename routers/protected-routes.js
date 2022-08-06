const express = require('express'),
  _ = require('lodash'),
  jwt_decode = require('jwt-decode'),
  jwt = require('jsonwebtoken'),
  cookieParser = require('cookie-parser'),
  usersearching = require('../usersearching'),
  config = require('../config.json');


app = module.exports = express.Router()

app.use(cookieParser());

const createIdToken = (user) => {
  return jwt.sign(user, config.secret, { expiresIn: 60 * 60 * 5 });
}

const getUserScheme = (req) => { //req의 user 정보를 객체로 만들어 메모리에 저장

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

const createAccessToken = () => {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (20),
    //scope: 'full_access',               
    authLevel: 1,
    sub: "lalaland|gonto",
    jti: genJti(),
    alg: 'HS256'
  }, config.secret);
}

const createPowerAccessToken = () => {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    //scope: 'full_access',               
    authLevel: 2,
    sub: "lalaland|gonto",
    jti: genJti(),
    alg: 'HS256'
  }, config.secret);
}

const genJti = () => {
  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    jti += possible.cazA
    return jti;
  }
}

app.post('/login', async (req, res) => {

  let param = getUserScheme(req);

  if (!param.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  let userdataset = await usersearching.findOne({ username: req.body.username });
  
  //let user = await usersearching.findOne({username:req.body.username}); 

  //let user = _.find(userdatas, getuserScheme.userSearch);

  if (userdataset.length === 0) {
    return res.status(401).send("The username or password don't match1");
  }

  let user = userdataset[0]._doc;

  let thisuser = {
    username: user.username,
    //password: user.password,
    email: user.email,
    id: user.id
  }

  if (user.password !== req.body.password) {
    return res.status(401).send("The username or password don't match2");
  }

  const cookieConfig = {
    httpOnly: true,
    maxAge: 3600000,
  };

  try {
    const result = {
      id_token: createIdToken(thisuser),
      access_token: createAccessToken()
    }
    res.status(201).cookie('mycookie', result, cookieConfig);
    res.status(201).send('success');

  }

  catch (ex) {
    console.error(ex);
  }
});

app.get('/Auth', (req, res) => {

  if (!req.cookies.mycookie) {
    return res.status(401).send('The token does not exist.');
  }

  let token = req.cookies.mycookie.access_token;

  let decoded = jwt_decode(token);

  if (decoded.iss !== config.issuer || decoded.aud !== config.audience) {
    return res.status(401).send('The token could not be validated.');
  }
  else if (decoded.iss === config.issuer && decoded.aud === config.audience) {
    return res.status(201).send('success');
  }
});