import JWT from "jsonwebtoken";
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendEmail from "../utils/sendEmail.js";
import emailQueue from "../utils/emailQueue.js";



// A function to check if an email exits in your database
const emailExist = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
}

//A function to get user details by email
const userDetails = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

export default class AuthService {
    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access!"
            })
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credential!"
            })
        }

        // Exclude the password field from the response
        const { id, name, email: userEmail } = user;

        // Sign a JWT token
        const token = JWT.sign({
            email
        }, process.env.ACCESS_TOKEN_SECRET_KEY);

        return res.status(200).json({
            msg: "Login successfully!",
            token,
            user: { id, name, email: userEmail }
        })
    }


    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            // Check if the email is already in use
            const emailAlreadyExist = await emailExist(email);
            if (emailAlreadyExist) {
                return res.status(400).json({
                    message: "Email is already in use"
                });
            }

            // Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);

            // Proceed with user registration since email is unique and validation passed
            const user = await User.create({ name, email, password: hashedPassword });

            // Generate JWT token
            const token = JWT.sign({
               email:  user.email
            }, process.env.ACCESS_TOKEN_SECRET_KEY);

            return res.status(200).json({
                message: "Registration successful, now you can login with email & password",
                user: { id: user.id, name, email: user.email },
                // token
            });
        } catch (error) {
            // Customize error message
            if (error.name === 'ValidationError') {
                const errors = {};
                for (const [key, value] of Object.entries(error.errors)) {
                    errors[key] = value.message;
                }
                return res.status(400).json({
                    msg: "Validation failed",
                    errors
                });
            }
            next(error);
        }

    }

    static async changePassword(req, res, next) {
        const { currentPassword, newPassword } = req.body;
        const { email } = req.user;

        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            // Compare the current password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Current password is incorrect"
                })
            }

            // Check current password & new password same or not
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    message: "Please use different password"
                })
            }

            // Hash the new password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRound);

            // Update the user password into database
            user.password = hashedPassword;
            await user.save();

            return res.status(200).json({
                message: "Password changed successfully"
            })
        } catch (error) {
            next(error)
        }
    }

    static async forgetPassword(req, res, next) {
        const { email } = req.body;
        try {
            const user = await userDetails(email);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            // Generate a reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

            // Set token and expiry on user (assuming your User model has these fields)
            user.resetPasswordToken = resetTokenHash;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            // Send email with the reset token
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            const context = { resetUrl, name : user.name };
            await emailQueue.add({ 
                email: user.email, 
                subject: 'Password Reset', 
                template: 'resetPasswordTemplate.ejs',
                context: context 
            });

            // Respond immediately
            res.status(200).json({
                message: 'A password reset link has been sent to your registered email address.'
            });
            return;


        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: { $gt: Date.now() }
                // The expression { $gt: Date.now() } is a MongoDB query operator that is used to compare a field value against the current date and time.
            });
            if (!user) {
                return res.status(400).json({
                    message: "Invalid or expired token"
                })
            }

            // Hash the new password
            const saltRound = 10;
            user.password = await bcrypt.hash(newPassword, saltRound);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.status(200).json({
                message: "Password reset successfully"
            });
        } catch (error) {
            next(error);
        }

    }
}

