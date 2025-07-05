const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  let token = req.header('x-auth-token');

  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fix here: assign the decoded directly (assumes payload is { id: ... })
    req.user = decoded;

    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
