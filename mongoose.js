const mongoose = require('mongoose')

const dbUrl = 'mongodb://' +
  'PowerUser:7048' + // 관리자아이디 : 비밀번호
  '@' +
  'mongodb' + // host
  ':27017' + // port
  '/jwtusers'; // db : admin db는 로그인을 위한 db 

  const connect = () => {
  mongoose.connect(dbUrl, {
    dbName: 'jwtusers', // 실제로 데이터 저장할 db명
    useNewUrlParser: true,
  }, (error) => {
    if (error) {
      console.log('mongodb connecting error', error);
    } else {
      console.log('mongodb connecting success');
    }
  });
};

module.exports = connect;