
const Student = require("../models/Student");

// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single student
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: "Invalid student ID" });
    }
};

// Add a student
const createStudent = async (req, res) => {
    try {
        const { name, email, course, semester } = req.body;

        const student = await Student.create({
            name,
            email,
            course,
            semester,
        });

        res.status(201).json({
            message: "Student added successfully",
            student,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: error.message });
    }
};

// Update a student
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(400).json({ message: "Invalid student data or ID" });
    }
};

// Delete a student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid student ID" });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};
