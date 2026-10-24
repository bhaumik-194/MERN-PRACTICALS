const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const uploadRoutes = require("./routes/uploadRoutes");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("File Upload Module is Running");
});

// Upload routes
app.use("/api", uploadRoutes);

// Handle upload and other errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.message,
        });
    }

    if (err) {
        return res.status(400).json({
            message: err.message,
        });
    }

    next();
});

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
