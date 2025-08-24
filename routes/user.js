const { Router } = require("express");
const { userModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/auth");

const userRouter = Router();

// Zod validation schema for signup
const signupSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required")
});

userRouter.post("/signup", async function(req, res){
    try {
        // Zod validation
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const newUser = await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Signup succeeded",
            token: token
        });
    } catch(error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Handle other errors
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Zod validation schema for signin
const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

userRouter.post("/signin", async function(req, res){
    try {
        // Zod validation
        const { email, password } = signinSchema.parse(req.body);

        // Find user in database
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_USER_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Signin successful",
            token: token
        });
    } catch(error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        // Handle other errors
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// lets user purchase a course
userRouter.get("/purchases", userMiddleware, function(req, res){
    res.json({
        message: "purchase course endpoint",
        userId: req.userId,
        userEmail: req.userEmail
    })
});

module.exports = {
    userRouter: userRouter
}