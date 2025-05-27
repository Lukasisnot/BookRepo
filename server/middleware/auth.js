const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decodedToken = jwt.verify(token, "secretKey");
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

exports.authorizeUser = (requiredRole) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  } catch (error) {
    console.error('Error authorizing user:', error);
    res.status(500).json({ error: 'An error occurred while authorizing the user' });
  }
};