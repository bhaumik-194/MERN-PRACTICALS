const Employee = require('../models/Employee');

// GET all employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ADD employee
const addEmployee = async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            department: req.body.department,
            salary: req.body.salary
        });

        const savedEmployee = await employee.save();

        res.status(201).json({
            message: "Employee added successfully",
            employee: savedEmployee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE employee
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee updated successfully",
            employee: employee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE employee
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};