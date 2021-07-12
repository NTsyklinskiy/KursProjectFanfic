const jwt = require('jsonwebtoken');

module.exports = (token) => {
  if(!token || token === undefined) return null;
    return new Promise(async (resolve, reject) => {
      console.log('token',token);
      const authUser = await jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            reject("Invalid token");
        } else {
            return decoded;
        }
    });
  
      if (authUser) {
        resolve(authUser);
      } else {
        reject("Couldn't authenticate user");
      } 
    });
  };