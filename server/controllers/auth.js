import { userLoginSchema, userSignupSchema, adminLoginSchema, createAdminSchema, editAdminSchema, editUserSchema } from "../validation/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import z from "zod";
import otpGenerator from "otp-generator";

// export const userSignup = async (req, res) => {
//     try {
//         // Validate input
//         userSignupSchema.parse(req.body);
//         const { name, mobileNumber, city, clinicName, speciality } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ mobileNumber });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Generate OTP (you should integrate a real OTP sending logic here)
//         const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
//         // Save the new user
//         const newUser = new User({ name, mobileNumber, city, clinicName, speciality });
//         await newUser.save();  // Make sure the user is saved
//         console.log("User saved successfully");
//         // Send response with OTP (mock)
//         res.status(200).json({ message: 'OTP generated successfully', otp });
//     } catch (err) {
//         if (err instanceof z.ZodError) {
//             return res.status(422).json({ errors: err.errors });
//         }
//         res.status(500).json({ error: err.message });
//     }
// };

export const userLogin = async (req, res) => {
    try {
        // Validate input
        userLoginSchema.parse(req.body);
        const { mobileNumber } = req.body;

        // Check if user exists
        let user = await User.findOne({ mobileNumber });
        if (!user) {
            // Create a new user if not found
            user = new User({ mobileNumber });
            await user.save();
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
        // Validate input using Zod schema
        adminLoginSchema.parse(req.body);
        const { email, password } = req.body;

        // Check if email and password are present
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        // Find admin user by email
        const admin = await User.findOne({ email, role: 'admin' });

        if (!admin) {
            return res.status(400).send('Invalid credentials');
        }

        // Check if admin has a valid password
        if (!admin.password) {
            return res.status(500).send('Admin password is missing or invalid');
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

// Get Users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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

// Edit User
export const editUser = async (req, res) => {
    try {
        // Validate input
        editUserSchema.parse(req.body);
        const { id, name, city, clinicName, speciality } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user only if provided
        user.name = name;
        user.city = city.toLowerCase();
        user.clinicName = clinicName;
        user.speciality = speciality;
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });   
    }
}

// // get user
export const getUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}