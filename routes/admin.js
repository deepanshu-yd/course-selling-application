const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/auth");

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
        console.log("Admin signup request received:");
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);

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

        console.log("Admin signup successful for:", email);

        res.json({
            message: "Admin signup succeeded",
            token: token
        });
    } catch(error) {
        console.error("Admin signup error:", error);

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
            message: "Internal server error",
            error: error.message
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
        console.log("Admin signin request received:");
        console.log("Request body:", req.body);

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

        console.log("Admin signin successful for:", email);

        res.json({
            message: "Admin signin successful",
            token: token
        });
    } catch(error) {
        console.error("Admin signin error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        // Handle other errors
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Zod validation schema for course creation
const courseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Valid image URL is required"),
    price: z.number().positive("Price must be a positive number")
});

adminRouter.post("/course", adminMiddleware, async function(req, res){
    try {
        console.log("Admin ID from middleware:", req.adminId);
        console.log("Request body:", req.body);

        const adminId = req.adminId;

        // Zod validation
        const { title, description, imageUrl, price } = courseSchema.parse(req.body);

        // Create course in database
        const course = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId
        });

        res.json({
            message: "Course created successfully",
            courseId: course._id
        });
    } catch(error) {
        console.error("Course creation error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        // Handle other errors
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Zod validation schema for course update
const courseUpdateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Valid image URL is required"),
    price: z.number().positive("Price must be a positive number"),
    courseId: z.string().min(1, "Course ID is required")
});

adminRouter.put("/course", adminMiddleware, async function(req, res){
    try {
        console.log("Admin ID from middleware:", req.adminId);
        console.log("Request body:", req.body);

        const adminId = req.adminId;

        // Zod validation
        const { title, description, imageUrl, price, courseId } = courseUpdateSchema.parse(req.body);

        // Update course in database
        const result = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        },{
            title, description, imageUrl, price
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course not found or you don't have permission to update it"
            });
        }

        res.json({
            message: "Course updated successfully",
            courseId: courseId
        });
    } catch(error) {
        console.error("Course update error:", error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }

        // Handle other errors
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message: "courses retrieved successfully",
        courses: courses
    })
});

module.exports = {
    adminRouter: adminRouter
}