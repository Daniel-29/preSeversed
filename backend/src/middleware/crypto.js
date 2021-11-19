const crypto = require('crypto');

const algorithm = 'aes-256-ctr';


const encryptCrypto = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, process.env.SECRET_KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString('hex').concat(";").concat(iv.toString('hex'));
};

const decryptCrypto = (hash) => {
    const data = hash.split(";")
    
    const decipher = crypto.createDecipheriv(algorithm, process.env.SECRET_KEY, Buffer.from(data[1], 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(data[0], 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encryptCrypto,
    decryptCrypto
};