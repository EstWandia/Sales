import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = req.cookies?.auth_token;
    if (!token) {
        return res.status(401).redirect('/'); // Redirect to login page if not authenticated
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).redirect('/'); // Redirect to login page if token is invalid
    }
};
