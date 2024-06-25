import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        req.user = user;
        next();
    })
}

export default authMiddleware;