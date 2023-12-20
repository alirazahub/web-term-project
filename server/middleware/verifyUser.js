import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

export const verifyUser = (req, res, next) => {
    const token = req.header('x-auth-admin');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
}
export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.render("unauth");
};