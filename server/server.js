
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Online Survey Backend is running successfully!");
});
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    regNo: {
        type: String,
        required: true,
        trim: true
    },
    sessionTitle: {
        type: String,
        required: true,
        trim: true
    },
    q1: {
        type: String,
        required: true
    },
    q2: {
        type: String,
        required: true
    },
    q3: {
        type: String,
        required: true
    },
    q4: {
        type: String,
        required: true
    },
    q5: {
        type: String,
        required: true
    },
    q6: {
        type: String,
        default: "None"
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Submit feedback
app.post("/api/feedback", async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Get all feedback
app.get("/api/feedback", async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({
            submittedAt: -1
        });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching feedback"
        });
    }
});

// Get dashboard statistics
app.get("/api/dashboard", async (req, res) => {
    try {
        const feedback = await Feedback.find();

        const totalResponses = feedback.length;

        const ratings = feedback.map(item =>
            parseInt(item.q3)
        ).filter(rating => !isNaN(rating));

        const averageRating = ratings.length
            ? (
                ratings.reduce((sum, rating) => sum + rating, 0)
                / ratings.length
              ).toFixed(1)
            : "0.0";

        const departmentCounts = {};

        feedback.forEach(item => {
            departmentCounts[item.department] =
                (departmentCounts[item.department] || 0) + 1;
        });

        const recommendCount = feedback.filter(
            item => item.q4 === "Yes"
        ).length;

        res.json({
            totalResponses,
            averageRating,
            recommendCount,
            departmentCounts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error loading dashboard"
        });
    }
});

// Delete feedback
app.delete("/api/feedback/:id", async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);

        res.json({
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting feedback"
        });
    }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
    }
}

startServer();
