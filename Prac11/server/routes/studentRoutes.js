
const express = require("express");
const router = express.Router();

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
