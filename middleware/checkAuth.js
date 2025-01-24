import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  // Check if the user is already authenticated via a session or other mechanism
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Extract token from cookies
  const token = req.cookies?.auth_token;

  // If no token, redirect to the login page
  if (!token) {
    return res.status(401).redirect('/pages/sample/login');
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request for downstream use
    next();
  } catch (err) {
    // If the token is invalid, redirect to the login page
    console.error('Authentication error:', err.message);
    return res.status(401).redirect('/pages/sample/login');
  }
};
