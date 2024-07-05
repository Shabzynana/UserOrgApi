const { prisma } = require('../../prisma/client');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


// login required
function authMiddleware(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(401).send('You need to log in first');
    }
}  

// protect route
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware, ConfirmedUserMiddleware};

