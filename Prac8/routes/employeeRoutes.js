const express = require('express');

const router = express.Router();

const {
    getEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

// GET all employees
router.get("/", getEmployees);

// GET employee by ID
router.get("/:id", getEmployeeById);

// ADD employee
router.post("/", addEmployee);

// UPDATE employee
router.put("/:id", updateEmployee);

// DELETE employee
router.delete("/:id", deleteEmployee);

module.exports = router;