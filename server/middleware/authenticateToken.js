// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized if no token found

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if invalid token
    req.user = user; // Attach user data from the token
    next();
  });
}

module.exports = authenticateToken;