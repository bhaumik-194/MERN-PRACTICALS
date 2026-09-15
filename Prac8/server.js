const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


const employeeRoutes = require("./routes/employeeRoutes");
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = 5000;

app.use(express.json())
app.use("/api/employees", employeeRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected!')
})
.catch((err) => {
    console.log(err)
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})