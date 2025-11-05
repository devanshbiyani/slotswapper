const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiry } = require('../config/auth');

function sign(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
}

function verify(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { sign, verify };
