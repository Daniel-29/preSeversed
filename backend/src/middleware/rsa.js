const NodeRSA = require('node-rsa');

const encrypt = (data) => {
  try {
    const key = new NodeRSA(process.env.KEY);
    const encrypted = key.encrypt(data, 'hex');
    return encrypted;
  } catch (error) {
    console.log(error);
  }
}

const decrypt = (data) => {
  try {
    const key = new NodeRSA(process.env.KEY);
    var base64String = Buffer.from(data, 'hex').toString('base64')
    var decrypted = key.decrypt(base64String, 'utf8').replace(`"`, '');
    return decrypted.replace(`"`, '');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { encrypt, decrypt };