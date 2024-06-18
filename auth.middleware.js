// const { verify } = require("jsonwebtoken");
import { verify } from 'jsonwebtoken';

//  Authentication middleware
const authMiddleware = async (req, res, next) => {
    const  authorization  = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(" ")[1];
        try {
            const user = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    errMessage: "Invalid Bearer Token"
                });
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                errMessage: 'Access token expired, please refresh again'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            Message: 'There is no token attached in header'
        });
    }
}

// Authorization middleware
// Check is Admin or not , its work after authMiddleware
function authorizeRole(roles) {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You can\'t access this route'
            });
        }
        next();
    };
}

// Check user is a block user or not
const isBlock = async (req, res, next) => {
    if (req.user.isBlocked === true) {
        return res.status(401).json({
            success: false,
            message: 'You are block now try after some time'
        });
    }
    next();
}


module.exports = { authMiddleware, authorizeRole, isBlock };