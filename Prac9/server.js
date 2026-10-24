
const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(logger);

app.get("/", (req, res) => {
    res.send("Welcome to Practical 9 - Express Server");
});

app.use("/api", studentRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
