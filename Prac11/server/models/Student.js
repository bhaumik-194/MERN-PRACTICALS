
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        course: {
            type: String,
            required: [true, "Course is required"],
            trim: true,
        },
        semester: {
            type: Number,
            required: [true, "Semester is required"],
            min: 1,
            max: 8,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);
