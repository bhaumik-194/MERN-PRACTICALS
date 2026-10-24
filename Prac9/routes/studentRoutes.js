
const express = require("express");
const router = express.Router();

let students = [
    { id: 1, name: "Bhaumik", course: "MSc CA & IT" },
    { id: 2, name: "Rahul", course: "BCA" },
];

// GET: Retrieve all students
router.get("/students", (req, res) => {
    res.json({
        message: "Students fetched successfully",
        students: students,
    });
});

// GET: Retrieve a student using route parameters
router.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find((s) => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found",
        });
    }

    res.json(student);
});

// GET: Handle query parameters
router.get("/search", (req, res) => {
    const course = req.query.course;

    const result = students.filter(
        (s) =>
            s.course.toLowerCase() ===
            (course || "").toLowerCase()
    );

    res.json({
        message: "Search completed",
        students: result,
    });
});

// POST: Handle data sent in the request body
router.post("/students", (req, res) => {
    const { name, course } = req.body;

    if (!name || !course) {
        return res.status(400).json({
            message: "Name and course are required",
        });
    }

    const newStudent = {
        id: students.length
            ? Math.max(...students.map((s) => s.id)) + 1
            : 1,
        name,
        course,
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent,
    });
});

module.exports = router;
