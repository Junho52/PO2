const userschema = require('./userschema');

const findAll = async () => {
  const docs = await userschema.find();
  return docs;
}

const findOne = async (param) => {
  const docs = await userschema.find(param)
  return docs; 
}

module.exports = {findAll, findOne};

