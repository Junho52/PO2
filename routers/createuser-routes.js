const express   = require('express'),
  _             = require('lodash');
  usersearching = require('../usersearching');
  userschema    = require('../userschema');

app = module.exports = express.Router()

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

//nomal id
app.post('/register', async (req, res) => {

  let getuserScheme = getUserScheme(req);

  let userdatas = await usersearching.findAll();
  
  if (!getuserScheme.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  if (_.find(userdatas, getuserScheme.userSearch)) {
    
    return res.status(400).send("A user with that username already exists");
  }


  let profile = _.pick(req.body, getuserScheme.type, 'password', 'extra');
  //getuserScheme.type이 있어야 username이 정상적으로 등록됨
  
  let setid = () => {
    if (!(_.find(userdatas, 'id'))){
      return 1;
    } else {
      return (_.max(userdatas, 'id').id + 1);
    }
  }
  
  const userdata = {
    username: profile.username,
    password: profile.password,
    id: setid()
  }
 
  try { // db에 저장
    userschema.create(userdata);
    const result = ('create user successfull')
    res.send(result);
  }
    
  catch(ex) {  
    console.error(ex);
  }
});
