const express = require('express');
const studentRoutes = require("./routes/studentRoutes")

const app = express();
const PORT = 5000;

app.use(express.json())

app.use("/api/students",studentRoutes);

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

