const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = 5000;

app.use(express.json())

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