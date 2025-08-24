const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/(to remove)-auth");

const adminRouter = Router();

// Zod validation schema for admin signup
const adminSignupSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required")
});

adminRouter.post("/signup", async function(req, res){
    try {
        // Zod validation
        const { email, password, firstName, lastName } = adminSignupSchema.parse(req.body);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin in database
        const newAdmin = await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        // Generate JWT token
        const token = jwt.sign(
            { adminId: newAdmin._id, email: newAdmin.email },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Admin signup succeeded",
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

// Zod validation schema for admin signin
const adminSigninSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

adminRouter.post("/signin", async function(req, res){
    try {
        // Zod validation
        const { email, password } = adminSigninSchema.parse(req.body);

        // Find admin in database
        const admin = await adminModel.findOne({ email: email });

        if (!admin) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Admin signin successful",
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

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    // watch the video of "Creating a web3 saas in 6 hours" to understand how to let users upload their image and not ask for an imageUrl
    const course = await courseModel.create({
        title, description, imageUrl, price, creatorId: adminId
    })

    res.json({
        message: "course created",
        courseId: course._id
    })
});

adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminID = req.userId;

    const { title, description, imageUrl, price, courseID } = req.body;

    const course = await courseModel.updateOne({
        _id: courseID,
        creatorId: adminID
    },{
        title, description, imageUrl, price, creatorId: adminId
    })

    res.json({
        message: "course updated",
        courseId: course._id
    })
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminID = req.userId;

    const courses = await courseModel.find({
        creatorId: adminID
    });

    res.json({
        message: "course updated",
        courses: 
    })
});

module.exports = {
    adminRouter: adminRouter
}