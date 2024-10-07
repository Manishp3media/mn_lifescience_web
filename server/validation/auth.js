import { z } from "zod";

export const userSignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits").max(10, "Mobile number must be at most 10 digits"),
    city: z.string().min(1, "City is required").optional(),
});

export const userLoginSchema = z.object({
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number must be at most 15 digits"),
    otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

export const adminLoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const createAdminSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const editAdminSchema = z.object({
    newEmail: z.string().email("Invalid email format").optional(),
    newPassword: z.string().min(4, "Password must be at least 4 characters long").optional(),
    confirmPassword: z.string().optional(),
});
