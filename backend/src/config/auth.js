module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiry: '1h'
};
