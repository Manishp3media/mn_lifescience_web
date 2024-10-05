import { userLoginSchema, userSignupSchema, adminLoginSchema, createAdminSchema, editAdminSchema } from "../validation/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import z from "zod";
import otpGenerator from "otp-generator";

export const userSignup = async (req, res) => {
    try {
        // Validate input
        userSignupSchema.parse(req.body);
        const { name, mobileNumber, city } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        // Here, you would typically send OTP via SMS using an SMS API
        res.status(200).json({ message: 'OTP generated successfully', otp });
        
        // Save the user temporarily (could also create an OTP expiration logic if needed)
        const newUser = new User({ name, mobileNumber, city });
        await newUser.save();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        // Validate input
        userLoginSchema.parse(req.body);
        const { mobileNumber, otp } = req.body;

        // Check if user exists
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        // Validate input
        adminLoginSchema.parse(req.body);
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(400).send('Invalid credentials');
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        // Validate input
        createAdminSchema.parse(req.body);
        const { email, password } = req.body;

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin account already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const admin = new User({ email, password: hashedPassword, role: 'admin' });

        // Save the admin
        await admin.save();
        res.status(201).json('Admin created successfully');
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
};

export const editAdmin = async (req, res) => {
    try {
        // Validate input
        editAdminSchema.parse(req.body);
        const { id: id } = req.params; // Get admin ID from request params
        const { newEmail, newPassword, confirmPassword } = req.body;

        // Check if passwords match
        if (newPassword && newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Find the admin by ID
        const admin = await User.findOne({ _id: id, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Hash the new password if provided
        if (newPassword) {
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        // Update the admin's email if provided
        admin.email = newEmail || admin.email;

        // Save the updated admin
        await admin.save();
        res.status(200).json({ message: 'Admin email and password updated successfully' });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        console.error('Error updating admin email and password:', err);
        res.status(500).json({ error: err.message });
    }
};
