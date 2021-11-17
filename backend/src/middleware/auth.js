const jwt = require("jsonwebtoken")
const { decrypt } = require("./rsa")

const createJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const authenticate2 = async (ctx) => {
  const token = ctx.req.headers?.cookie?.toString().slice(6) || ""
  try {
    //var verified = jwt.verify(token, process.env.JWT_SECRET)
    var verified = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Verification success!")
    return verified.user._id

  } catch (err) {
    console.log("Verification failed!")
    return "undi"
  }
}
const authenticate = async (req, res, next) => {
  try {
    if (!(req.headers.operation == 'login' || req.headers.operation == 'register')) {
      const token = req.headers.authorization || ""
      var verified = jwt.verify(token, process.env.JWT_SECRET)
      req.verifiedUser = {_id: (decrypt(verified.user._id))};
      console.log("Verification success!", req.headers.operation)
      next()
    } else {
      next();
    }
  } catch (err) {
    console.log("Verification failed!.", req.headers.operation)
    next()
  }
}

module.exports = { authenticate, createJwtToken }
