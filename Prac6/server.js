const express = require('express');
const studentRoutes = require('./routes/studentRoutes')
const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;

app.use("/",studentRoutes)
app.use(logger)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})