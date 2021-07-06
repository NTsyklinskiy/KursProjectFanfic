const jwt = require('jsonwebtoken');

module.exports = (user, secret) => {
    const { id,email, role } = user;
    const token = jwt.sign({id,email,role}, secret);
    return token;
  };
  