import { z } from "zod";

// Schema for Register
export const registerSchema = z.object({
    name: z.string().max(255).min(5),
    email: z.string().email(),
    password: z.string().max(50).min(5)
});

// Schema for Login
export const loginSchema = z.object({
    password: z.string().max(255).min(5),
    email: z.string().email(),
});

// Schema for Change password
export const changePasswordSchema = z.object({
    currentPassword: z.string().max(50).min(5),
    newPassword: z.string().max(255).min(5)
})

// Schema for forget password
export const forgetPasswordSchema = z.object({
    email: z.string().email()
})

// Schema for reset password
export const resetPasswordSchema = z.object({
    newPassword: z.string().max(255).min(5)
})

// Schema for Post create
export const createPost  = z.object({
    title : z.string().max(255).min(5),
    description : z.string().max(255).min(5),
})

