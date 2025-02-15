import express from 'express';
import AuthService from '../services/auth.service.js';
import { validationMiddleware } from '../validation.js';
import { registerSchema, loginSchema, changePasswordSchema, forgetPasswordSchema, resetPasswordSchema } from '../zod.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const authRoute =  express.Router();

authRoute.post('/login', [validationMiddleware(loginSchema)],AuthService.login);
authRoute.post('/register',[validationMiddleware(registerSchema)], AuthService.register);
authRoute.post('/change-password',[validationMiddleware(changePasswordSchema)], [authenticateToken], AuthService.changePassword);

authRoute.post('/forget-password',[validationMiddleware(forgetPasswordSchema),AuthService.forgetPassword ])
// Route to handle requests without the token
authRoute.put('/reset-password', (req, res) => {
    return res.status(400).json({ message: "Invalid token" });
});

// Route to handle requests with the token
authRoute.put('/reset-password/:token',[validationMiddleware(resetPasswordSchema)], AuthService.resetPassword)
export default authRoute

