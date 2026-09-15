const express = require('express');

const router = express.Router();

router.get('/',(req, res) => {
    res.send("Student Home");
});

router.get('/students',(req, res) => {
    res.json({
        message: "Student data fetched successfully.",
        students: [
            {id:1, name:"Bhaumik", age:21},
            {id:2, name:"Shaurya", age:20},
        ]
    })
});

module.exports = router;